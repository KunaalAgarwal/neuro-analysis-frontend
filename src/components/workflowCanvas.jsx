import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import WorkflowItem from './workflowItem';
import '../styles/workflowCanvas.css';

function WorkflowCanvas({ index, workflowItems, updateCurrentWorkspaceItems }) {
  const canvasRef = useRef(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'WORKFLOW_ITEM',
    drop: (item) => handleDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drop(canvasRef); // Register the canvas as a drop target

  const handleDrop = (item) => {
    const newItem = { name: item.name, position: { x: 10, y: 10 } }; // Temporary fixed position
    const updatedItems = [...workflowItems, newItem];
    updateCurrentWorkspaceItems(updatedItems); // Use the hook function to update
  };

  return (
    <div
      ref={canvasRef}
      className={`workflow-canvas ${isOver ? 'is-over' : ''}`}
    >
      {workflowItems.map((item, idx) => (
        <WorkflowItem key={idx} name={item.name} position={item.position} />
      ))}
    </div>
  );
}

export default WorkflowCanvas;
