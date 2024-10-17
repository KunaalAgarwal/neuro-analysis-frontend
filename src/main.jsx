import React from 'react';
import ReactDOM from 'react-dom/client';
import ActionsBar from './components/actionsBar';
import HeaderBar from './components/headerBar';
import WorkflowMenu from './components/workflowMenu';
import ToggleWorkflowBar from './components/toggleWorkflowBar';
import WorkflowCanvas from './components/workflowCanvas';

// Import React DnD and the HTML5 backend
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/background.css';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-layout">
        <HeaderBar />
        <ActionsBar />
        <div className="d-flex" style={{ height: 'calc(100vh - 160px)' }}>
          <WorkflowMenu />
          <WorkflowCanvas />
        </div>
        <ToggleWorkflowBar />
      </div>
    </DndProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

export default App;
