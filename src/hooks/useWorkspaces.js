import { useState, useEffect } from 'react';

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState(() => {
    const savedWorkspaces = JSON.parse(localStorage.getItem('workspaces')) || [[]];
    return savedWorkspaces;
  });

  const [currentWorkspace, setCurrentWorkspace] = useState(() => {
    const savedIndex = parseInt(localStorage.getItem('currentWorkspace'), 10) || 0;
    return savedIndex;
  });

  useEffect(() => {
    localStorage.setItem('workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem('currentWorkspace', currentWorkspace);
  }, [currentWorkspace]);

  const addNewWorkspace = () => {
    setWorkspaces([...workspaces, []]);
    setCurrentWorkspace(workspaces.length);
  };

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
