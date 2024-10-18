import React from 'react';
import ReactDOM from 'react-dom/client';
import ActionsBar from './components/actionsBar';
import HeaderBar from './components/headerBar';
import WorkflowMenu from './components/workflowMenu';
import ToggleWorkflowBar from './components/toggleWorkflowBar';
import WorkflowCanvas from './components/workflowCanvas';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
  } = useWorkspaces();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-layout">
        <HeaderBar />
        <ActionsBar 
          onNewWorkspace={addNewWorkspace} 
          onClearWorkspace={clearCurrentWorkspace} 
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
    </DndProvider>
  );
}


ReactDOM.createRoot(document.getElementById('root')).render(<App />);
