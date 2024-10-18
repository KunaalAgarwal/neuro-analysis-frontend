import React from 'react';
import WorkflowMenuItem from './workflowMenuItem';
import '../styles/workflowMenu.css';

function WorkflowMenu() {
  const items = [
    'Brain Extraction',
    'Segmentation',
    'Registration',
    'Smoothing',
    'Filtering',
    'Transformation',
    'Preprocessing',
    'Normalization',
    'Feature Extraction',
  ];

  const handleDragStart = (event, name) => {
    event.dataTransfer.setData('node/name', name);
    console.log(`Dragging: ${name}`);
  };

  return (
    <div className="workflow-menu">
      {items.map((item, index) => (
        <WorkflowMenuItem
          key={index}
          name={item}
          onDragStart={handleDragStart}
        />
      ))}
    </div>
  );
}

export default WorkflowMenu;