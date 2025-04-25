const tool_map = {
    'Brain Extraction': '../../cwl/fsl/bet.cwl'
}


export function useGenerateWorkflow() {
    const generateWorkflow = (getWorkflowData) => {
        if (typeof getWorkflowData !== 'function') {
            console.error('Error: getWorkflowData is not a function');
            return;
        }

        const workflowData = getWorkflowData();
        if (!workflowData) {
            console.error('Error: No workflow data available');
            return;
        }

        // Convert to JSON (or a text format of your choice)
        const fileContent = JSON.stringify(workflowData, null, 2);

        // Download the file
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'workflow.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return { generateWorkflow };
}
