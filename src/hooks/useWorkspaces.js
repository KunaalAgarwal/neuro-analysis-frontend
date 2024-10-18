import { useState, useEffect } from 'react';

export function useWorkspaces() {
  // Initialize state from localStorage or use defaults if nothing is stored
  const [workspaces, setWorkspaces] = useState(() => {
    const savedWorkspaces = JSON.parse(localStorage.getItem('workspaces'));
    return savedWorkspaces ? savedWorkspaces : [[]]; // Default to a blank workspace
  });

  const [currentWorkspace, setCurrentWorkspace] = useState(() => {
    const savedIndex = parseInt(localStorage.getItem('currentWorkspace'), 10);
    return !isNaN(savedIndex) ? savedIndex : 0; // Default to the first workspace
  });

  // Save workspaces to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  // Save the current workspace index to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentWorkspace', currentWorkspace);
  }, [currentWorkspace]);

  const addNewWorkspace = () => {
    setWorkspaces((prevWorkspaces) => [...prevWorkspaces, []]);
    setCurrentWorkspace(workspaces.length); // Switch to the new workspace
  };

  const clearCurrentWorkspace = () => {
    setWorkspaces((prevWorkspaces) => {
      const updatedWorkspaces = [...prevWorkspaces];
      updatedWorkspaces[currentWorkspace] = [];
      return updatedWorkspaces;
    });
  };

  const updateCurrentWorkspaceItems = (newItems) => {
    setWorkspaces((prevWorkspaces) => {
      const updatedWorkspaces = [...prevWorkspaces];
      updatedWorkspaces[currentWorkspace] = newItems;
      return updatedWorkspaces;
    });
  };

  return {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    addNewWorkspace,
    clearCurrentWorkspace,
    updateCurrentWorkspaceItems,
  };
}
