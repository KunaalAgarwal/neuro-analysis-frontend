import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import WorkflowItem from './workflowItem';
import '../styles/workflowCanvas.css';

function WorkflowCanvas() {
  const [workflowItems, setWorkflowItems] = useState([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'WORKFLOW_ITEM',
    drop: (item, monitor) => addWorkflowItem(item, monitor),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addWorkflowItem = (item, monitor) => {
    const { x, y } = monitor.getClientOffset(); // Get drop position
    setWorkflowItems((prevItems) => [
      ...prevItems,
      { ...item, position: { x, y } },
    ]);
  };

  return (
    <div
      ref={drop}
      className={`workflow-canvas ${isOver ? 'is-over' : ''}`}
    >
      {workflowItems.map((item, index) => (
        <WorkflowItem key={index} name={item.name} position={item.position} />
      ))}
    </div>
  );
}

export default WorkflowCanvas;
