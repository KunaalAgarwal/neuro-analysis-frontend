import React from 'react';
import { useDrag } from 'react-dnd';
import '../styles/workflowMenuItem.css';

function WorkflowMenuItem({ name }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'WORKFLOW_ITEM',
    item: { name }, // Data to pass when dropped
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="workflow-menu-item"
      style={{
        opacity: isDragging ? 0.5 : 1, // Visual feedback while dragging
      }}
    >
      {name}
    </div>
  );
}

export default WorkflowMenuItem;
