function getWorkspaces() {
    const workspaces = JSON.parse(localStorage.getItem('workspaces'));
    return workspaces || [[]]; 
}

function getCurrentWorkspaceIndex() {
    const currentIndex = parseInt(localStorage.getItem('currentWorkspace'), 10);
    return isNaN(currentIndex) ? 0 : currentIndex; // Default to 0 if not set
}

function updateCurrentWorkspaceItems(newItems) {
    const workspaces = getWorkspaces();
    const currentIndex = getCurrentWorkspaceIndex();
    console.log(`Updating workspace at index ${currentIndex} with items:`, newItems);

    workspaces[currentIndex] = newItems;
    localStorage.setItem('workspaces', JSON.stringify(workspaces));
}

function clearCurrentWorkspace() {
    console.log('Clearing current workspace');
    updateCurrentWorkspaceItems([]); // Clear all items in the current workspace
}

export {
    getWorkspaces,
    getCurrentWorkspaceIndex,
    updateCurrentWorkspaceItems,
    clearCurrentWorkspace
};
