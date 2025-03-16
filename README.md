# Neuro-imaging Analysis Workflow Generator
To streamline the process of creating fMRI (etc.) image analysis workflows we've created the following graphical user interface (GUI). 
Users can create workflows in the GUI using common analysis operations from FSL, AFNI, and SPM. Once, the workflow has created the user can directly generate a 
zip file containing the Common Workflow Language ([CWL](https://www.commonwl.org/user_guide/introduction/index.html)) workflow along with the CWL tool dependencies.

### [Deployment](https://kunaalagarwal.github.io/neuro-analysis-frontend/)

### Running Locally
``git clone 'https://github.com/KunaalAgarwal/neuro-analysis-frontend.git'``

``npm install``

``npm run dev``

### Contributions

While contributing to this repository be sure to use a development branch and merge that branch once your changes are stable in the dev environment.
``git branch <branch_name>`` ``git checkout <branch_name>`` ``git checkout main`` ``git merge -m 'commit message' <branch_name>``

This is crucial as GitHub Actions has been configured to automatically deploy the repository to GitHub pages upon all pushed commits to the main branch. 

### Authorship 

This project was created by Kunaal Agarwal and advised by Javier Rasero, PhD, under the funding of the University of Virginia Harrison Research Award. 