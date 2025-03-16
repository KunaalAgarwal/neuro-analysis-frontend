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

// Define node types outside the component.
const nodeTypes = {
  default: NodeComponent
};

// Define edge types outside the component to prevent re-renders.
const edgeTypes = {};

function WorkflowCanvas({ workflowItems, updateCurrentWorkspaceItems, onSetWorkflowData }) {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Use a ref to detect when the workspace (i.e. workflowItems) changes,
  // so we only initialize local state when switching workspaces.
  const prevWorkflowItemsRef = useRef();

  // Initialize local nodes and edges when the workspace changes.
  useEffect(() => {
    if (prevWorkflowItemsRef.current !== workflowItems) {
      const initialNodes = (workflowItems.nodes || []).map((item, idx) => ({
        id: `${idx}`,
        type: 'default',
        data: {
          label: item.label,
          parameters: item.parameters || '',
          onSaveParameters: (newParams) => handleNodeUpdate(`${idx}`, newParams),
        },
        position: item.position || { x: 100 + idx * 50, y: 100 },
      }));
      const initialEdges = workflowItems.edges || [];
      setNodes(initialNodes);
      setEdges(initialEdges);
      prevWorkflowItemsRef.current = workflowItems;
    }
  }, [workflowItems]);

  // Helper to update the parent workspace state.
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

  // Connect edges.
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

  // Drag-and-drop new nodes.
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
    updateWorkspaceState(updatedNodes, edges);
  };

  // Delete nodes and corresponding edges.
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

  // Return the entire workflow for exporting.
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

  // Provide getWorkflowData to parent.
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
