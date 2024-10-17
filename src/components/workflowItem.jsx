import React from 'react';
import '../styles/workflowItem.css';

function WorkflowItem({ name, timeToComplete }) {
  return (
    <div className="workflow-item">
      <p>{name}</p>
      <small>Time to complete: {timeToComplete} s</small>
    </div>
  );
}

export default WorkflowItem;
