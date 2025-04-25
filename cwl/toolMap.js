/**
 * Minimal static registry that links a canvas label to:
 *  - its CWL file (path relative to project root / repo root)
 *  - the primary outputs we need to expose downstream
 */

export const TOOL_MAP = {
    'Brain Extraction': {
        id: 'bet',
        cwlPath: 'cwl/fsl/bet.cwl',
        primaryOutputs: ['brain_image']
    }
};