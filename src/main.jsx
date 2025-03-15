import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import ActionsBar from './components/actionsBar';
import HeaderBar from './components/headerBar';
import WorkflowMenu from './components/workflowMenu';
import ToggleWorkflowBar from './components/toggleWorkflowBar';
import WorkflowCanvas from './components/workflowCanvas';
import { useWorkspaces } from './hooks/useWorkspaces';
import { useGenerateWorkflow } from './hooks/generateWorkflow';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/background.css';

function App() {
    const {
        workspaces,
        currentWorkspace,
        setCurrentWorkspace,
        addNewWorkspace,
        clearCurrentWorkspace,
        updateCurrentWorkspaceItems,
        removeCurrentWorkspace
    } = useWorkspaces();

    // This state will eventually hold a function returned by WorkflowCanvas
    const [getWorkflowData, setGetWorkflowData] = useState(null);

    const { generateWorkflow } = useGenerateWorkflow();

    return (
        <div>
            <div className="app-layout">
                <HeaderBar />
                <ActionsBar
                    onNewWorkspace={addNewWorkspace}
                    onClearWorkspace={clearCurrentWorkspace}
                    onRemoveWorkspace={removeCurrentWorkspace}
                    workspaceCount={workspaces.length}
                    // On click, we pass our function to generateWorkflow
                    onGenerateWorkflow={() => generateWorkflow(getWorkflowData)}
                />
                <div className="workflow-content">
                    <WorkflowMenu />
                    <WorkflowCanvas
                        workflowItems={workspaces[currentWorkspace]}
                        updateCurrentWorkspaceItems={updateCurrentWorkspaceItems}
                        onSetWorkflowData={setGetWorkflowData}
                    />
                    <ToggleWorkflowBar
                        current={currentWorkspace}
                        workspaces={workspaces}
                        onChange={setCurrentWorkspace}
                    />
                </div>
            </div>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
