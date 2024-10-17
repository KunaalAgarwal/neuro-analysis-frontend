import { useState, useEffect } from 'react';

// Custom hook to manage workspaces with persistence in localStorage
export function useWorkspaces() {
  // Initialize workspaces from localStorage or default to a blank workspace
  const [workspaces, setWorkspaces] = useState(() => {
    const savedWorkspaces = localStorage.getItem('workspaces');
    return savedWorkspaces ? JSON.parse(savedWorkspaces) : [[]];
  });

  // Initialize the current workspace index from localStorage or default to 0
  const [currentWorkspace, setCurrentWorkspace] = useState(() => {
    const savedIndex = localStorage.getItem('currentWorkspace');
    return savedIndex !== null ? parseInt(savedIndex, 10) : 0;
  });

  // Save workspaces to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  // Save the current workspace index to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentWorkspace', currentWorkspace);
  }, [currentWorkspace]);

  // Add a new blank workspace and switch to it
  const addNewWorkspace = () => {
    setWorkspaces([...workspaces, []]);
    setCurrentWorkspace(workspaces.length);
  };

  // Clear the contents of the current workspace
  const clearCurrentWorkspace = () => {
    const updatedWorkspaces = [...workspaces];
    updatedWorkspaces[currentWorkspace] = [];
    setWorkspaces(updatedWorkspaces);
  };

  return {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    addNewWorkspace,
    clearCurrentWorkspace,
  };
}
