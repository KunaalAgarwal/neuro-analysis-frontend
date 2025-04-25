cwlVersion: v1.2
class: CommandLineTool
label: Brain Extraction (FSL BET)
doc: |
  Wrapper for FSL's BET (Brain Extraction Tool).
  Version pinned to FSL 7.1.1 for reproducibility.
baseCommand: bet
hints:
  DockerRequirement:
    dockerPull: brainlife/fsl:7.1.1
inputs:
  input_file:
    type: File
    label: Input T1-weighted image
    inputBinding:
      position: 1
  output_prefix:
    type: string
    label: Output file prefix (no extension)
    inputBinding:
      position: 2

  # ---------- optional CLI flags ----------
  frac:
    type: ['null', double]
    label: Fractional intensity threshold (-f)
    inputBinding:
      position: 3
      prefix: -f
      separate: true
    default: 0.50        # BET default
  mask:
    type: ['null', boolean]
    label: Generate binary brain mask image (-m)
    inputBinding:
      prefix: -m
      separate: false
  robust:
    type: ['null', boolean]
    label: Robust brain centre estimation (-R)
    inputBinding:
      prefix: -R
      separate: false

  # expose more flags here as needed …

stdout: bet.log
outputs:
  brain_image:
    type: File
    outputBinding:
      glob: $(inputs.output_prefix)_brain.nii.gz
  brain_mask:
    type: ['null', File]
    outputBinding:
      glob: $(inputs.output_prefix)_brain_mask.nii.gz
  log:
    type: File
    outputBinding:
      glob: bet.log
