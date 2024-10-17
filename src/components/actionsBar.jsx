import React from 'react';
import '../styles/actionsBar.css';

const ActionsBar = () => (
  <div className="actions-bar">
    <button className="btn btn-secondary btn-lg">New Workspace</button>
    <div className="separator"></div> 
    <button className="btn btn-secondary btn-lg">Clear Workspace</button>
    <div className="separator"></div>
    <button className="btn btn-primary btn-lg">Generate Workflow</button>
  </div>
);

export default ActionsBar;