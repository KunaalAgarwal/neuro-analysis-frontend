import YAML from 'js-yaml';
import { TOOL_MAP } from '../../cwl/toolMap.js';

export function buildCWLWorkflow(graph) {
    const { nodes, edges } = graph;

    const inEdgesOf = id => edges.filter(e => e.target === id);
    const outEdgesOf = id => edges.filter(e => e.source === id);

    const order = [];
    const incoming = Object.fromEntries(nodes.map(n => [n.id, 0]));
    edges.forEach(e => incoming[e.target]++);
    const queue = nodes.filter(n => incoming[n.id] === 0).map(n => n.id);
    while (queue.length) {
        const id = queue.shift();
        order.push(id);
        outEdgesOf(id).forEach(e => {
            if (--incoming[e.target] === 0) queue.push(e.target);
        });
    }

    const wf = {
        cwlVersion: 'v1.2',
        class: 'Workflow',
        inputs: {},
        outputs: {},
        steps: {}
    };

    order.forEach(nodeId => {
        const node = nodes.find(n => n.id === nodeId);
        const { label, parameters } = node.data;
        const tool = TOOL_MAP[label];
        if (!tool) throw new Error(`No mapping for ${label}`);

        const stepId = `step_${nodeId}`;
        const step = { run: tool.cwlPath, in: {}, out: tool.primaryOutputs };

        // a) wire upstream edges
        inEdgesOf(nodeId).forEach(e => {
            const srcStep = `step_${e.source}`;
            tool.primaryOutputs.forEach(o => {
                // simplistic: assume single output name match
                step.in[o] = `${srcStep}/${o}`;
            });
        });

        // b) bake parameters
        const paramObj = parameters && typeof parameters === 'object'
            ? parameters
            : {};
        Object.entries(paramObj).forEach(([key, value]) => {
            if (value && value.expose) {
                wf.inputs[key] = { type: 'string' };  // tweak type if known
                step.in[key] = key;
            } else {
                step.in[key] = value.value ?? value;  // accept either {value:} or raw
            }
        });

        wf.steps[stepId] = step;
    });

    const lastNode = nodes.find(n => n.id === order.at(-1));
    const lastStep = `step_${lastNode.id}`;
    TOOL_MAP[lastNode.data.label].primaryOutputs.forEach(o => {
        wf.outputs[o] = { type: 'File', outputSource: `${lastStep}/${o}` };
    });

    return YAML.dump(wf);
}
