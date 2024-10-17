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

  return (
    <div className="workflow-menu-container">
      <div className="workflow-menu">
        {items.map((item, index) => (
          <WorkflowMenuItem key={index} name={item} />
        ))}
      </div>
    </div>
  );
}

export default WorkflowMenu;