import React, { useState, useEffect, useRef } from 'react';
import WorkflowMenuItem from './workflowMenuItem';
import '../styles/workflowMenu.css';

function WorkflowMenu() {
  const [maxHeight, setMaxHeight] = useState('auto');
  const canvasRef = useRef(null);

  useEffect(() => {
    // Measure the height of the WorkflowCanvas and set it as max height for the menu
    const updateMenuHeight = () => {
      const canvasHeight = canvasRef.current?.offsetHeight || window.innerHeight;
      setMaxHeight(`${canvasHeight - 40}px`); // Add a small margin
    };

    // Run on load and on window resize
    window.addEventListener('resize', updateMenuHeight);
    updateMenuHeight();

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', updateMenuHeight);
  }, []);

  const items = [
    'Brain Extraction', 
    'Segmentation', 
    'Registration', 
    'Smoothing', 
    'Filtering',
  ];

  return (
    <div className="workflow-menu-container" style={{ maxHeight }} ref={canvasRef}>
      <div className="workflow-menu">
        {items.map((item, index) => (
          <WorkflowMenuItem key={index} name={item} />
        ))}
      </div>
    </div>
  );
}

export default WorkflowMenu;
