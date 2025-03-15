import React, { useRef, useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from 'reactflow';

import 'reactflow/dist/style.css';
import '../styles/workflowCanvas.css';
import '../styles/actionsBar.css';

import NodeComponent from './NodeComponent';

const nodeTypes = {
  default: NodeComponent
};

function WorkflowCanvas({ workflowItems, updateCurrentWorkspaceItems, onSetWorkflowData }) {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Whenever the workflowItems array changes (or on mount),
  // build up the local node state from it:
  useEffect(() => {
    const initialNodes = workflowItems.map((item, idx) => ({
      id: `${idx}`,
      type: 'default',
      data: {
        label: item.data.label,
        parameters: item.data.parameters || '',
        // Pass a callback to let the node save changes:
        onSaveParameters: (newParams) => handleNodeUpdate(`${idx}`, newParams),
      },
      position: item.position || { x: 100 + idx * 50, y: 100 },
    }));

    setNodes(initialNodes);
    setEdges([]); // Reset edges each time
  }, [workflowItems]);

  // Function to update a node’s parameters, called by onSaveParameters in the node
  const handleNodeUpdate = (nodeId, updatedParameters) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((node) =>
          node.id === nodeId
              ? { ...node, data: { ...node.data, parameters: updatedParameters } }
              : node
      );

      updateCurrentWorkspaceItems(updatedNodes); // Sync changes to local storage
      return updatedNodes;
    });
  };

  // When connecting two nodes with an edge
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

  // Drag-and-drop new nodes from the WorkflowMenu
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
      data: {
        label: name,
        parameters: '',
        onSaveParameters: (newParams) =>
            handleNodeUpdate(`${nodes.length}`, newParams),
      },
      position: flowPosition,
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    updateCurrentWorkspaceItems(updatedNodes);
  };

  // When user deletes one or more nodes
  const onNodesDelete = useCallback(
      (deletedNodes) => {
        setNodes((prevNodes) => {
          const updatedNodes = prevNodes.filter(
              (node) => !deletedNodes.find((deleted) => deleted.id === node.id)
          );
          updateCurrentWorkspaceItems(updatedNodes); // Sync with local storage
          return updatedNodes;
        });

        // Remove edges linked to deleted nodes
        setEdges((prevEdges) =>
            prevEdges.filter(
                (edge) =>
                    !deletedNodes.some(
                        (node) => edge.source === node.id || edge.target === node.id
                    )
            )
        );
      },
      [updateCurrentWorkspaceItems]
  );

  // Helper function that returns the complete workflow
  const getWorkflowData = () => ({
    nodes: nodes.map((node) => ({
      id: node.id,
      label: node.data.label,
      parameters: node.data.parameters,
      position: node.position,
    })),
    edges: edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
    })),
  });

  // Provide the getWorkflowData function to the parent (so it can do export, etc.)
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
              onNodesDelete={onNodesDelete}
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
