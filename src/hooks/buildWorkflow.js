import YAML from 'js-yaml';
import { TOOL_MAP } from '../../public/cwl/toolMap.js';

/**
 * Convert the React-Flow graph into a CWL Workflow YAML string.
 * Uses static TOOL_MAP metadata to wire inputs/outputs correctly.
 */
export function buildCWLWorkflow(graph) {
    const { nodes, edges } = graph;

    /* ---------- helper look-ups ---------- */
    const nodeById   = id => nodes.find(n => n.id === id);
    const inEdgesOf  = id => edges.filter(e => e.target === id);
    const outEdgesOf = id => edges.filter(e => e.source === id);

    /* ---------- topo-sort (Kahn's algorithm) ---------- */
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

    // Track source nodes (no incoming edges)
    const sourceNodeIds = new Set(
        nodes.filter(n => inEdgesOf(n.id).length === 0).map(n => n.id)
    );

    /* ---------- walk nodes in topo order ---------- */
    order.forEach((nodeId) => {
        const node = nodeById(nodeId);
        const { label } = node.data;
        const tool = TOOL_MAP[label];

        if (!tool) {
            throw new Error(`No tool mapping for label "${label}"`);
        }

        const stepId = `step_${nodeId}`;
        const incomingEdges = inEdgesOf(nodeId);

        // Step skeleton with correct relative path
        const step = {
            run: `../${tool.cwlPath}`,
            in: {},
            out: tool.primaryOutputs
        };

        /* ---------- handle required inputs ---------- */
        Object.entries(tool.requiredInputs).forEach(([inputName, inputDef]) => {
            const { type, passthrough } = inputDef;

            if (passthrough) {
                // This input receives upstream output or becomes workflow input
                if (incomingEdges.length > 0) {
                    // Wire from upstream node's primary output
                    const srcEdge = incomingEdges[0];
                    const srcNode = nodeById(srcEdge.source);
                    const srcTool = TOOL_MAP[srcNode.data.label];
                    const srcStepId = `step_${srcEdge.source}`;
                    step.in[inputName] = `${srcStepId}/${srcTool.primaryOutputs[0]}`;
                } else {
                    // Source node - expose as workflow input
                    const wfInputName = sourceNodeIds.size === 1
                        ? 'input_file'
                        : `${stepId}_input_file`;
                    wf.inputs[wfInputName] = { type };
                    step.in[inputName] = wfInputName;
                }
            } else {
                // Non-passthrough required input - expose as workflow input
                const wfInputName = nodes.length === 1
                    ? inputName
                    : `${stepId}_${inputName}`;
                wf.inputs[wfInputName] = { type };
                step.in[inputName] = wfInputName;
            }
        });

        wf.steps[stepId] = step;
    });

    /* ---------- declare workflow outputs from terminal nodes ---------- */
    const terminalNodes = nodes.filter(n => outEdgesOf(n.id).length === 0);

    terminalNodes.forEach(node => {
        const tool = TOOL_MAP[node.data.label];
        const stepId = `step_${node.id}`;

        tool.primaryOutputs.forEach(outputName => {
            const outputDef = tool.outputs[outputName];
            const wfOutputName = terminalNodes.length === 1
                ? outputName
                : `${stepId}_${outputName}`;

            // Get type from outputs definition, default to File
            let outputType = outputDef?.type || 'File';

            // Convert 'File?' shorthand to CWL array syntax ['null', 'File']
            if (typeof outputType === 'string' && outputType.endsWith('?')) {
                outputType = ['null', outputType.slice(0, -1)];
            }

            wf.outputs[wfOutputName] = {
                type: outputType,
                outputSource: `${stepId}/${outputName}`
            };
        });
    });

    return YAML.dump(wf);
}