import React, { useRef, useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';

function WorkflowCanvas({ workflowItems, updateCurrentWorkspaceItems, onSetWorkflowData }) {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  useEffect(() => {
    const initialNodes = workflowItems.map((item, idx) => ({
      id: `${idx}`,
      type: 'default',
      data: { label: item.data.label },
      position: item.position || { x: 100 + idx * 50, y: 100 },
      className: 'custom-node'
    }));
    setNodes(initialNodes);
    setEdges([]); // Reset edges on workspace clear
  }, [workflowItems]);

  const onConnect = useCallback((connection) => {
    setEdges((eds) =>
        addEdge(
            {
              ...connection,
              markerEnd: { type: 'arrowclosed', width: 10, height: 10 },
              style: { strokeWidth: 2 },
            },
            eds
        )
    );
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const name = event.dataTransfer.getData('node/name') || 'Unnamed Node';

    if (!reactFlowInstance) return;

    const flowPosition = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode = {
      id: `${nodes.length}`,
      type: 'default',
      data: { label: name },
      position: flowPosition,
      className: 'custom-node',
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    updateCurrentWorkspaceItems(updatedNodes);
  };

  // Detect node deletions (via Backspace/Delete key)
  const onNodesDelete = useCallback((deletedNodes) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.filter(node => !deletedNodes.find(deleted => deleted.id === node.id));
      updateCurrentWorkspaceItems(updatedNodes); // Sync with localStorage
      return updatedNodes;
    });

    // Remove edges linked to deleted nodes
    setEdges((prevEdges) => prevEdges.filter(edge =>
        !deletedNodes.some(node => edge.source === node.id || edge.target === node.id)
    ));
  }, [updateCurrentWorkspaceItems]);

  const getWorkflowData = () => ({
    nodes: nodes.map(node => ({
      id: node.id,
      label: node.data.label,
      position: node.position
    })),
    edges: edges.map(edge => ({
      source: edge.source,
      target: edge.target
    }))
  });

  useEffect(() => {
    if (onSetWorkflowData) {
      onSetWorkflowData(() => getWorkflowData);
    }
  }, [nodes, edges, onSetWorkflowData]);

  return (
      <div className="workflow-canvas" style={{ height: '100%', width: '100%' }}>
        <div
            ref={reactFlowWrapper}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="workflow-canvas"
            style={{ height: '81%', width: '99%' }}
        >
          <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodesDelete={onNodesDelete}  // Handles node deletion
              fitView
              onInit={(instance) => setReactFlowInstance(instance)}
          >
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
            <Controls />
          </ReactFlow>
        </div>
      </div>
  );
}

export default WorkflowCanvas;
