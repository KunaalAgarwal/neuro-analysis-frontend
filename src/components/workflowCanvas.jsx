import React, { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import WorkflowItem from './workflowItem';
import '../styles/workflowCanvas.css';

function WorkflowCanvas() {
  const [workflowItems, setWorkflowItems] = useState([]);
  const canvasRef = useRef(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'WORKFLOW_ITEM',
    drop: (item, monitor) => handleDrop(item, monitor),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drop(canvasRef); // Ensure drop is registered on the canvas

  const handleDrop = (item, monitor) => {
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const clientOffset = monitor.getClientOffset();
  
    // Calculate the relative position within the canvas
    const x = clientOffset.x - canvasRect.left;
    const y = clientOffset.y - canvasRect.top;
  
    console.log('Client Offset:', clientOffset);
    console.log('Canvas Rect:', canvasRect);
    console.log('Calculated Position:', { x, y });
  
    // Ensure the item is within canvas bounds
    const clampedX = Math.max(0, Math.min(x, canvasRect.width));
    const clampedY = Math.max(0, Math.min(y, canvasRect.height));
  
    setWorkflowItems((prevItems) => [
      ...prevItems,
      { name: item.name, position: { x: clampedX, y: clampedY } },
    ]);
  };

  return (
    <div
      ref={canvasRef}
      className={`workflow-canvas ${isOver ? 'is-over' : ''}`}
    >
      {workflowItems.map((item, index) => (
        <WorkflowItem key={index} name={item.name} position={item.position} />
      ))}
    </div>
  );
}

export default WorkflowCanvas;
