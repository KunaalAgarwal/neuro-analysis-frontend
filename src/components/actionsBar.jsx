import React from 'react';
import '../styles/actionsBar.css';

const ActionsBar = ({ onNewWorkspace,  onClearWorkspace, onRemoveWorkspace}) => (
  <div className="actions-bar">
    <button className="actions-button" onClick={onNewWorkspace}>New Workspace</button>
    <div className="separator"></div>
    <button className="actions-button" onClick={onClearWorkspace}>Clear Workspace</button>
    <div className="separator"></div>
    <button className="actions-button" onClick={onRemoveWorkspace}>Remove Workspace</button>
    <div className="separator"></div>
    <button className="actions-button btn-primary btn-lg">Generate Workflow</button>
  </div>
);

export default ActionsBar;
