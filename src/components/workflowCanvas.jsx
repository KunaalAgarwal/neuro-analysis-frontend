import React, { useRef, useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';

function WorkflowCanvas({ workflowItems, updateCurrentWorkspaceItems, onSetWorkflowData }) {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  useEffect(() => {
    const initialNodes = workflowItems.map((item, idx) => ({
      id: String(idx),
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
      id: String(nodes.length),
      type: 'default',
      data: { label: name },
      position: flowPosition,
      className: 'custom-node',
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    updateCurrentWorkspaceItems(updatedNodes);
  };

  // This function returns the workflow data the parent needs
  const getWorkflowData = () => ({
    nodes: nodes.map((node) => ({
      id: node.id,
      label: node.data.label,
      position: node.position,
    })),
    edges: edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
    })),
  });

  // On every render, provide the parent with a fresh function reference
  useEffect(() => {
    if (onSetWorkflowData) {
      // Must pass a FUNCTION here, not the result of getWorkflowData()
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
