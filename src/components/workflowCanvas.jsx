import React, { useRef, useState, useCallback, useEffect } from 'react';
import ReactFlow, { addEdge, Background, Controls, MiniMap, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

function WorkflowCanvas({ workflowItems, updateCurrentWorkspaceItems }) {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // Initialize nodes from workflowItems on component mount or update
  useEffect(() => {
    const initialNodes = workflowItems.map((item, idx) => ({
      id: `${idx}`,
      type: 'default',
      data: { label: item.data.label },
      position: item.position || { x: 100 + idx * 50, y: 100 },
      className: 'custom-node'
    }));
    setNodes(initialNodes);
  }, [workflowItems]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const name = event.dataTransfer.getData('node/name') || 'Unnamed Node';

    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    const newNode = {
      id: `${nodes.length}`,
      type: 'default',
      data: { label: name }, 
      position,
      className: 'custom-node'
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    updateCurrentWorkspaceItems(updatedNodes); //sync state
  };

  return (
    <div className="workflow-canvas" style={{ height: '100%', width: '100%' }}>
      <div
        ref={reactFlowWrapper}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="workflow-canvas"
        style={{ height: '100%', width: '100%' }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
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
