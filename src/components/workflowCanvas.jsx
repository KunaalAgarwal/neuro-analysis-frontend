import React, { useRef, useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';

function WorkflowCanvas({ workflowItems, updateCurrentWorkspaceItems }) {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

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
    const name = event.dataTransfer.getData('node/name') || 'Unnamed Node';

    // only project the position if we have a valid ReactFlow instance
    if (!reactFlowInstance) return;

    // convert screen coords into the React Flow coordinate system
    const flowPosition = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });

    // create the new node
    const newNode = {
      id: `${nodes.length}`,
      type: 'default',
      data: { label: name },
      position: flowPosition,
      className: 'custom-node'
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    updateCurrentWorkspaceItems(updatedNodes);
  };

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
              fitView
              // onInit gives us the React Flow instance, which we store in reactFlowInstance
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
