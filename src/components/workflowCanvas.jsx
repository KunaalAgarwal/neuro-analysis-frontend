import React, { useRef, useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';

import 'reactflow/dist/style.css';
import '../styles/workflowCanvas.css';
import '../styles/actionsBar.css';

import NodeComponent from './NodeComponent';

// Define node types.
const nodeTypes = { default: NodeComponent };
// Define edge types.
const edgeTypes = {};

function WorkflowCanvas({ workflowItems, updateCurrentWorkspaceItems, onSetWorkflowData }) {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const prevWorkflowItemsRef = useRef();

  // When the workspace changes, initialize local state from the stored workspace.
  useEffect(() => {
    if (prevWorkflowItemsRef.current !== workflowItems) {
      // Assume workflowItems is an object: { nodes: [...], edges: [...] }
      const initialNodes = (workflowItems.nodes || []).map((node) => ({
        ...node,
        // Reattach the onSaveParameters callback without modifying the label.
        data: {
          ...node.data,
          onSaveParameters: (newParams) => handleNodeUpdate(node.id, newParams)
        }
      }));
      const initialEdges = workflowItems.edges || [];
      setNodes(initialNodes);
      setEdges(initialEdges);
      prevWorkflowItemsRef.current = workflowItems;
    }
  }, [workflowItems]);

  // Helper: update the persistent workspace (nodes & edges) on explicit interactions.
  const updateWorkspaceState = (updatedNodes, updatedEdges) => {
    if (updateCurrentWorkspaceItems) {
      updateCurrentWorkspaceItems({ nodes: updatedNodes, edges: updatedEdges });
    }
  };

  // Update a node’s parameters in local state.
  const handleNodeUpdate = (nodeId, updatedParameters) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((node) =>
          node.id === nodeId
              ? { ...node, data: { ...node.data, parameters: updatedParameters } }
              : node
      );
      updateWorkspaceState(updatedNodes, edges);
      return updatedNodes;
    });
  };

  // Create a new edge and update workspace state.
  const onConnect = useCallback((connection) => {
    setEdges((eds) => {
      const newEdges = addEdge(
          {
            ...connection,
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 10,
              height: 10,
            },
            style: { strokeWidth: 2 },
          },
          eds
      );
      updateWorkspaceState(nodes, newEdges);
      return newEdges;
    });
  }, [nodes, edges, updateCurrentWorkspaceItems]);

  // Handle drag-over.
  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  // On drop, create a new node using the label from the dragged item.
  const handleDrop = (event) => {
    event.preventDefault();
    const name = event.dataTransfer.getData('node/name') || 'Unnamed Node';
    if (!reactFlowInstance) return;

    const flowPosition = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode = {
      id: `${Date.now()}`, // unique id
      type: 'default',
      data: {
        label: name,
        parameters: '',
        onSaveParameters: (newParams) => handleNodeUpdate(newNode.id, newParams),
      },
      position: flowPosition,
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    updateWorkspaceState(updatedNodes, edges);
  };

  // On node deletion, remove nodes (and related edges) then update workspace.
  const onNodesDelete = useCallback(
      (deletedNodes) => {
        setNodes((prevNodes) => {
          const updatedNodes = prevNodes.filter(
              (node) => !deletedNodes.find((del) => del.id === node.id)
          );
          updateWorkspaceState(updatedNodes, edges);
          return updatedNodes;
        });

        setEdges((prevEdges) => {
          const updatedEdges = prevEdges.filter(
              (edge) =>
                  !deletedNodes.some(
                      (node) => edge.source === node.id || edge.target === node.id
                  )
          );
          updateWorkspaceState(nodes, updatedEdges);
          return updatedEdges;
        });
      },
      [nodes, edges, updateCurrentWorkspaceItems]
  );

  // Provide complete workflow data (nodes & edges) for exporting.
  const getWorkflowData = () => ({
    nodes: nodes.map((node) => ({
      id: node.id,
      data: node.data,
      position: node.position,
    })),
    edges: edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
    })),
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
              onNodesDelete={onNodesDelete}
              fitView
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
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
