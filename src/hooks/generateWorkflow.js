import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { buildCWLWorkflow } from './buildWorkflow.js';
import { TOOL_MAP } from '../../cwl/toolMap.js';

export function useGenerateWorkflow() {
    /**
     * Builds main.cwl, pulls tool CWL files, zips, and downloads.
     * Works both in `npm run dev` (BASE_URL = "/") and on GitHub Pages
     * (BASE_URL = "/neuro-analysis-frontend/").
     */
    const generateWorkflow = async (getWorkflowData) => {
        if (typeof getWorkflowData !== 'function') {
            console.error('generateWorkflow expects a function');
            return;
        }

        const graph = getWorkflowData();
        if (!graph) {
            alert('Empty workflow — nothing to export.');
            return;
        }

        /* ---------- build CWL workflow ---------- */
        let mainCWL;
        try {
            mainCWL = buildCWLWorkflow(graph);
        } catch (err) {
            alert(`Workflow build failed:\n${err.message}`);
            return;
        }

        /* ---------- prepare ZIP ---------- */
        const zip = new JSZip();
        zip.file('workflows/main.cwl', mainCWL);

        /* ---------- fetch each unique tool file ---------- */
        const uniquePaths = [
            ...new Set(graph.nodes.map(n => TOOL_MAP[n.data.label].cwlPath))
        ];

        // baseURL ends in "/", ensure single slash join
        const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');

        try {
            for (const p of uniquePaths) {
                const res = await fetch(`${base}${p}`);
                if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
                zip.file(p, await res.text());
            }
        } catch (err) {
            alert(`Unable to fetch tool file:\n${err.message}`);
            return;
        }

        /* ---------- download ---------- */
        const blob = await zip.generateAsync({ type: 'blob' });
        saveAs(blob, 'workflow_bundle.zip');
    };

    return { generateWorkflow };
}
