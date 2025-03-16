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

// Define node types outside the component
const nodeTypes = {
  default: NodeComponent
};

// Define edge types outside the component to prevent re-renders
const edgeTypes = {};

function WorkflowCanvas({ workflowItems, updateCurrentWorkspaceItems, onSetWorkflowData }) {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Initialize local nodes from workflowItems
  useEffect(() => {
    const initialNodes = workflowItems.map((item, idx) => ({
      id: `${idx}`,
      type: 'default',
      data: {
        label: item.data.label,
        parameters: item.data.parameters || '',
        onSaveParameters: (newParams) => handleNodeUpdate(`${idx}`, newParams),
      },
      position: item.position || { x: 100 + idx * 50, y: 100 },
    }));

    setNodes(initialNodes);
    setEdges([]);
  }, [workflowItems]);

  // Update a node’s parameters in local state and localStorage
  const handleNodeUpdate = (nodeId, updatedParameters) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((node) =>
          node.id === nodeId
              ? { ...node, data: { ...node.data, parameters: updatedParameters } }
              : node
      );

      updateCurrentWorkspaceItems(updatedNodes);
      return updatedNodes;
    });
  };

  // Connect edges
  const onConnect = useCallback((connection) => {
    setEdges((eds) =>
        addEdge(
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
        )
    );
  }, []);

  // Drag-and-drop new nodes
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

  // Delete nodes
  const onNodesDelete = useCallback(
      (deletedNodes) => {
        setNodes((prevNodes) => {
          const updatedNodes = prevNodes.filter(
              (node) => !deletedNodes.find((del) => del.id === node.id)
          );
          updateCurrentWorkspaceItems(updatedNodes);
          return updatedNodes;
        });

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

  // Return the entire workflow for exporting
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

  // Provide getWorkflowData to parent
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
              edgeTypes={edgeTypes} // Fix applied here
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
