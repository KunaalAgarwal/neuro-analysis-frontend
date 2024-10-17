import React, {useRef} from 'react';
import ReactDOM from 'react-dom/client';
import ActionsBar from './components/actionsBar';
import HeaderBar from './components/headerBar';
import WorkflowMenu from './components/workflowMenu';
import ToggleWorkflowBar from './components/toggleWorkflowBar';
import WorkflowCanvas from './components/workflowCanvas';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/background.css';

function App() {
    const canvasRef = useRef(null);
    return (
      <div className="app-layout">
        <HeaderBar />
        <ActionsBar />
        <div className="d-flex" style={{ height: 'calc(100vh - 160px)' }}>
          <WorkflowMenu canvasRef={canvasRef}/>
          <WorkflowCanvas ref={canvasRef}/>
        </div>
        <ToggleWorkflowBar />
      </div>
    );
  }


ReactDOM.createRoot(document.getElementById('root')).render(<App />);

export default App;