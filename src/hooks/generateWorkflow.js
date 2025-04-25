import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { buildCWLWorkflow } from './buildWorkflow.js';
import { TOOL_MAP } from '../../cwl/toolMap.js';

export function useGenerateWorkflow() {
    const generateWorkflow = async (getWorkflowData) => {
        const graph = getWorkflowData();
        if (!graph) return alert('No workflow data.');

        // 1 build workflow YAML
        const mainCWL = buildCWLWorkflow(graph);

        // 2 collect unique tool paths
        const toolPaths = [...new Set(
            graph.nodes.map(n => TOOL_MAP[n.data.label]?.cwlPath)
        )];

        // 3 build zip
        const zip = new JSZip();
        zip.file('workflows/main.cwl', mainCWL);

        for (const p of toolPaths) {
            // fetch tool text via Vite's dev server or GH Pages
            const txt = await fetch(`/${p}`).then(r => r.text());
            zip.file(p, txt);                    // keep folder hierarchy
        }

        const blob = await zip.generateAsync({ type: 'blob' });
        saveAs(blob, 'workflow_bundle.zip');
    };

    return { generateWorkflow };
}
