import React from 'react';
import { useDrag } from 'react-dnd';
import '../styles/workflowMenuItem.css';

function WorkflowMenuItem({ name }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'WORKFLOW_ITEM', 
    item: { type: 'WORKFLOW_ITEM', name }, 
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="workflow-menu-item" 
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {name}
    </div>
  );
}

export default WorkflowMenuItem;
