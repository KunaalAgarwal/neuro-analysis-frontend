import React from 'react';
import '../styles/actionsBar.css';

const ActionsBar = () => (
  <div className="actions-bar">
    <button>New Workspace</button>
    <div className="separator"></div> 
    <button>Clear Workspace</button>
    <div className="separator"></div>
    <button className="btn-primary btn-lg">Generate Workflow</button>
  </div>
);

export default ActionsBar;