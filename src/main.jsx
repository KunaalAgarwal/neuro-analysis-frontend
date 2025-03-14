import React from 'react';
import ReactDOM from 'react-dom/client';
import ActionsBar from './components/actionsBar';
import HeaderBar from './components/headerBar';
import WorkflowMenu from './components/workflowMenu';
import ToggleWorkflowBar from './components/toggleWorkflowBar';
import WorkflowCanvas from './components/workflowCanvas';
import { useWorkspaces } from './hooks/useWorkspaces';
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

  return (
      <div>
        <div className="app-layout">
          <HeaderBar />
          <ActionsBar
              onNewWorkspace={addNewWorkspace}
              onClearWorkspace={clearCurrentWorkspace}
              onRemoveWorkspace={removeCurrentWorkspace}
              // Pass down workspaceCount as a prop
              workspaceCount={workspaces.length}
          />
          <div className="d-flex">
            <WorkflowMenu />
            <WorkflowCanvas
                workflowItems={workspaces[currentWorkspace]}
                updateCurrentWorkspaceItems={updateCurrentWorkspaceItems}
            />
          </div>
          <ToggleWorkflowBar
              current={currentWorkspace}
              workspaces={workspaces}
              onChange={setCurrentWorkspace}
          />
        </div>
      </div>
  );
}


ReactDOM.createRoot(document.getElementById('root')).render(<App />);
