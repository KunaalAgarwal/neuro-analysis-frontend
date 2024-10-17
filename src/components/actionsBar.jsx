import React from 'react';
import '../styles/actionsBar.css';

const ActionsBar = () => (
  <div className="actions-bar">
    <button className="button">New Workspace</button>
    <div className="separator"></div> 
    <button className="button">Clear Workspace</button>
    <div className="separator"></div>
    <button className="button btn-primary btn-lg">Generate Workflow</button>
  </div>
);

export default ActionsBar;