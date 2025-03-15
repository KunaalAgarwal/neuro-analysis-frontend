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
    'Fnirt',
    'Flirt',
    '3D-Deconvolution',
    '3D-Merge',
    '3D-Shift'
  ];

  const handleDragStart = (event, name) => {
    event.dataTransfer.setData('node/name', name);
    console.log(`Dragging: ${name}`);
  };

  return (
    <div className="workflow-menu-container">
      <div className="workflow-menu">
        {items.map((item, index) => (
          <WorkflowMenuItem
            key={index}
            name={item}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>  
  );
}

export default WorkflowMenu;