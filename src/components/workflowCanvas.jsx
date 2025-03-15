import React, { useRef, useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from 'reactflow';

// Styling files
import 'reactflow/dist/style.css';
import '../styles/workflowCanvas.css';
import '../styles/actionsBar.css';


// Components
import NodeComponent from "./NodeComponent";

const nodeTypes = {
  default: NodeComponent
};

function WorkflowCanvas({ workflowItems, updateCurrentWorkspaceItems, onSetWorkflowData }) {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Load nodes from workspace on mount/update
  useEffect(() => {
    const initialNodes = workflowItems.map((item, idx) => ({
      id: `${idx}`,
      type: 'default',
      data: { label: item.data.label, parameters: item.data.parameters || "" },
      position: item.position || { x: 100 + idx * 50, y: 100 }
    }));
    setNodes(initialNodes);
    setEdges([]); // Reset edges on workspace clear
  }, [workflowItems]);

  // Function to update a node’s parameters
  const handleNodeUpdate = (nodeId, updatedParameters) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map(node =>
          node.id === nodeId ? { ...node, data: { ...node.data, parameters: updatedParameters } } : node
      );

      updateCurrentWorkspaceItems(updatedNodes); // Sync with local storage
      return updatedNodes;
    });
  };

  // Handle new connections
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

  // Handle drag-and-drop of new nodes
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
      data: { label: name, parameters: "" }, // Initialize with empty parameters
      position: flowPosition
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    updateCurrentWorkspaceItems(updatedNodes);
  };

  // Detect node deletions (via Backspace/Delete key)
  const onNodesDelete = useCallback((deletedNodes) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.filter(node => !deletedNodes.find(deleted => deleted.id === node.id));
      updateCurrentWorkspaceItems(updatedNodes); // Sync with local storage
      return updatedNodes;
    });

    // Remove edges linked to deleted nodes
    setEdges((prevEdges) => prevEdges.filter(edge =>
        !deletedNodes.some(node => edge.source === node.id || edge.target === node.id)
    ));
  }, [updateCurrentWorkspaceItems]);

  // Get workflow data for exporting
  const getWorkflowData = () => ({
    nodes: nodes.map(node => ({
      id: node.id,
      label: node.data.label,
      parameters: node.data.parameters,
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
      <div className="workflow-canvas">
        <div
            ref={reactFlowWrapper}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="workflow-canvas-container"
        >
          <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodesDelete={onNodesDelete} // Handles node deletion
              fitView
              nodeTypes={nodeTypes}
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
