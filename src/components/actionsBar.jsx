import React from 'react';
import '../styles/actionsBar.css';

const ActionsBar = ({ onNewWorkspace,  onClearWorkspace}) => (
  <div className="actions-bar">
    <button onClick={onNewWorkspace}>New Workspace</button>
    <div className="separator"></div>
    <button onClick={onClearWorkspace}>Clear Workspace</button>
    <div className="separator"></div>
    <button className="btn-primary btn-lg">Generate Workflow</button>
  </div>
);

export default ActionsBar;
