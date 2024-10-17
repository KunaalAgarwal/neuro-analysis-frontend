import React from 'react';
import Draggable from 'react-draggable';
import '../styles/workflowItem.css';

function WorkflowItem({ name, position }) {
  return (
    <Draggable bounds="parent" defaultPosition={position}>
      <div
        className="workflow-item"
        style={{ position: 'absolute', top: position.y, left: position.x }}
      >
        <p className='text'>{name}</p>
      </div>
    </Draggable>
  );
}

export default WorkflowItem;
