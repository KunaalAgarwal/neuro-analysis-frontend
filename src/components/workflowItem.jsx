import React from 'react';
import Draggable from 'react-draggable';
import '../styles/workflowItem.css';

function WorkflowItem({ name, position }) {
  return (
    <Draggable
      defaultPosition={position}
      bounds="parent" /* Restricts movement within the parent container (canvas) */
    >
      <div className="workflow-item">
        <p>{name}</p>
      </div>
    </Draggable>
  );
}

export default WorkflowItem;
