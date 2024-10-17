import React from 'react';
import WorkflowMenuItem from './workflowMenuItem';
import '../styles/workflowMenu.css';

function WorkflowMenu() {
  const items = [
    'Brain Extraction', 
    'Brain Segmentation', 
    'Brain Registration', 
    'Flirt', 
    'Fnirt',
    'Fast'
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