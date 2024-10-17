import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import WorkflowItem from './workflowItem';
import '../styles/workflowCanvas.css';

function WorkflowCanvas() {
  const [workflowItems, setWorkflowItems] = useState([]);

  // useDrop to handle items dropped on the canvas
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'WORKFLOW_ITEM',
    drop: (item) => addWorkflowItem(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addWorkflowItem = (item) => {
    setWorkflowItems((prevItems) => [...prevItems, item]);
  };

  return (
    <div
      ref={drop}
      className="workflow-canvas"
      style={{
        backgroundColor: isOver ? '#e0e0e0' : 'rgba(255, 255, 255, 0.05)', // Highlight on drag over
      }}
    >
      {workflowItems.map((item, index) => (
        <WorkflowItem key={index} name={item.name} />
      ))}
    </div>
  );
}

export default WorkflowCanvas;
