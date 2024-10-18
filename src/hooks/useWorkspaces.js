import { useState, useEffect } from 'react';

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState([[]]);
  const [currentWorkspace, setCurrentWorkspace] = useState(0);

  // Save workspaces to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

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
