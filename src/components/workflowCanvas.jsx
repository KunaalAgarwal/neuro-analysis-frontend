import React, { useState } from 'react';
import WorkflowItem from './workflowItem';
import '../styles/workflowCanvas.css';

function WorkflowCanvas() {
  const [workflowItems, setWorkflowItems] = useState([]);

  const addItem = () => {
    setWorkflowItems([
      ...workflowItems,
      {
        name: 'Brain Extraction',
        timeToComplete: Math.floor(Math.random() * 100),
      },
    ]);
  };

  return (
    <div className="workflow-canvas">
      <button onClick={addItem}>Add Workflow Item</button>
      {workflowItems.map((item, index) => (
        <WorkflowItem
          key={index}
          name={item.name}
          timeToComplete={item.timeToComplete}
        />
      ))}
    </div>
  );
}

export default WorkflowCanvas;
