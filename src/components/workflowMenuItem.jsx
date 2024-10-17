import React from 'react';
import '../styles/workflowMenuItem.css';

function WorkflowMenuItem({ name }) {
  return (
    <div className="workflow-menu-item">
      <p>{name}</p>
    </div>
  );
}

export default WorkflowMenuItem;
