import React from 'react';
import '../styles/workflowMenuItem.css';

function WorkflowMenuItem({ name, onDragStart }) {
  return (
    <div
      className="workflow-menu-item"
      draggable
      onDragStart={(event) => onDragStart(event, name)}
    >
      {name}
    </div>
  );
}

export default WorkflowMenuItem;
