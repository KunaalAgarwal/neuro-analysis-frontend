import React from 'react';
import '../styles/toggleWorkflowBar.css';

function ToggleWorkflowBar() {
  return (
    <div className="toggle-workflow-bar">
      <button className="button">&larr; Previous</button>
      <div className="page-numbers">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>...</span>
        <span>67</span>
        <span>68</span>
      </div>
      <button className="button">Next &rarr;</button>
    </div>
  );
}

export default ToggleWorkflowBar;
