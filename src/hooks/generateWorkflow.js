export function useGenerateWorkflow() {
    const generateWorkflow = () => {
        const fileContent = "Hello, World!";
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
