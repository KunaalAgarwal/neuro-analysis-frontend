# Neuro-imaging Analysis Workflow Generator

To streamline the process of creating fMRI and other neuro-imaging analysis workflows, we've developed this graphical user interface (GUI). Users can design workflows by selecting common analysis operations from FSL, AFNI, and SPM. Once the workflow is configured, you can directly generate a zip file containing the [Common Workflow Language (CWL)](https://www.commonwl.org/user_guide/introduction/index.html) workflow along with its tool dependencies.

### [Deployment](https://kunaalagarwal.github.io/fMRIbuild/)

### Running Locally

Clone the repository, install the dependencies, and start the development server:

```bash
git clone https://github.com/KunaalAgarwal/fMRIbuild.git
cd fMRIbuild
npm install
npm run dev
```

### Contributions

When contributing, please follow these best practices:

- **Use Development Branches:**  
  Create a new branch for each feature or bug fix. This allows you to test changes locally without triggering an automatic deployment.

  ```bash
  git checkout -b <branch_name>
  ```

- **Merging to Main:**  
  Once your changes have been tested and are stable in the development environment, merge them into the `main` branch.  
  **Important:** The repository is configured with GitHub Actions to automatically deploy to GitHub Pages on every push to the `main` branch.
  ```bash
  git checkout main
  git merge <branch_name> -m "Merge <branch_name>: commit message"
  git push origin main
  ```

### Deployment Workflow

Our deployment process uses GitHub Actions to automatically build and deploy the project whenever changes are pushed to the `main` branch. This ensures that the live site on GitHub Pages is always up-to-date with the latest stable code.

### Authorship

This project was created by Kunaal Agarwal and advised by Javier Rasero, PhD, under the funding of the University of Virginia Harrison Research Award.
