import YAML from 'js-yaml';
import { TOOL_MAP } from '../../cwl/toolMap.js';

/**
 * Convert the React-Flow graph into a CWL Workflow yaml string.
 * - Promotes parameter keys with {expose:true} to Workflow.inputs
 * - Bakes all other parameter values directly into the step
 */
export function buildCWLWorkflow(graph) {
    const { nodes, edges } = graph;

    /* ---------- helper look-ups ---------- */
    const inEdgesOf  = id => edges.filter(e => e.target === id);
    const outEdgesOf = id => edges.filter(e => e.source === id);

    /* ---------- topo-sort (Kahn) ---------- */
    const incoming = Object.fromEntries(nodes.map(n => [n.id, 0]));
    edges.forEach(e => incoming[e.target]++);
    const queue = nodes.filter(n => incoming[n.id] === 0).map(n => n.id);
    const order = [];

    while (queue.length) {
        const id = queue.shift();
        order.push(id);
        outEdgesOf(id).forEach(e => {
            if (--incoming[e.target] === 0) queue.push(e.target);
        });
    }

    if (order.length !== nodes.length) {
        throw new Error('Workflow graph has cycles.');
    }

    /* ---------- build CWL skeleton ---------- */
    const wf = {
        cwlVersion: 'v1.2',
        class: 'Workflow',
        inputs: {},
        outputs: {},
        steps: {}
    };

    /* ---------- walk nodes ---------- */
    order.forEach(nodeId => {
        const node = nodes.find(n => n.id === nodeId);
        const { label, parameters } = node.data;
        const tool = TOOL_MAP[label];
        if (!tool) throw new Error(`No tool mapping for label "${label}"`);

        // step skeleton
        const stepId = `step_${nodeId}`;
        const step = { run: tool.cwlPath, in: {}, out: tool.primaryOutputs };

        /* 1️⃣  upstream wiring */
        inEdgesOf(nodeId).forEach(e => {
            const srcStep = `step_${e.source}`;
            TOOL_MAP[
                nodes.find(n => n.id === e.source).data.label
                ].primaryOutputs.forEach(o => {
                if (!(o in step.in)) step.in[o] = `${srcStep}/${o}`;
            });
        });

        /* 2️⃣  parameter handling */
        let paramObj = {};
        if (parameters) {
            if (typeof parameters === 'string') {
                try { paramObj = JSON.parse(parameters); } catch {/* ignore */ }
            } else if (typeof parameters === 'object') {
                paramObj = parameters;
            }
        }


        Object.entries(paramObj).forEach(([k, v]) => {
            // expose at runtime
            if (v && typeof v === 'object' && v.expose) {
                wf.inputs[k] = { type: 'string' };          // TODO: smart type
                step.in[k] = k;
            }
            // constant via {value:…}
            else if (v && typeof v === 'object' && 'value' in v) {
                step.in[k] = v.value;
            }
            // raw constant
            else {
                step.in[k] = v;
            }
        });

        wf.steps[stepId] = step;
    });

    /* 3️⃣  declare workflow outputs from the last node’s primaries */
    const lastNode   = nodes.find(n => n.id === order.at(-1));
    const lastStepId = `step_${lastNode.id}`;
    TOOL_MAP[lastNode.data.label].primaryOutputs.forEach(o => {
        wf.outputs[o] = { type: 'File', outputSource: `${lastStepId}/${o}` };
    });

    return YAML.dump(wf);
}
