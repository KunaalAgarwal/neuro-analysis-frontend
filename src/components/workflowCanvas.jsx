import React, { useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import WorkflowItem from './workflowItem';
import '../styles/workflowCanvas.css';

function WorkflowCanvas({ index, visible }) {
  const canvasRef = useRef(null);
  const [workflowItems, setWorkflowItems] = useState(() => {
    const workspaces = JSON.parse(localStorage.getItem('workspaces')) || [[]];
    return workspaces[index] || [];
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'WORKFLOW_ITEM',
    drop: (item) => handleDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drop(canvasRef); // Register the drop target

  useEffect(() => {
    const workspaces = JSON.parse(localStorage.getItem('workspaces')) || [[]];
    workspaces[index] = workflowItems;
    localStorage.setItem('workspaces', JSON.stringify(workspaces));
  }, [workflowItems, index]);

  const handleDrop = (item) => {
    const newItem = { name: item.name, position: { x: 10, y: 10 } };
    setWorkflowItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <div
      id={`workspace-${index}`} // Labeling with workspace index
      ref={canvasRef}
      className={`workflow-canvas ${isOver ? 'is-over' : ''}`}
      style={{ display: visible ? 'block' : 'none' }} // Toggle visibility
    >
      {workflowItems.map((item, idx) => (
        <WorkflowItem key={idx} name={item.name} position={item.position} />
      ))}
    </div>
  );
}

export default WorkflowCanvas;
