import React from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from 'react-flow-renderer';
import CustomNode from './CustomNodes';

const nodeTypes = {
  start: CustomNode,
  input: CustomNode,
  api: CustomNode,
  ai: CustomNode,
  condition: CustomNode,
  database: CustomNode,
  output: CustomNode,
  end: CustomNode,
};

const WorkflowCanvas = ({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onConnect, 
  onNodeClick, 
  onPaneClick,
  onInit,
  selectedNode
}) => {
  return (
    <div className="workflow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={onInit}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        minZoom={0.2}
        maxZoom={2}
        snapToGrid={false}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 }
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls position="bottom-left" />
        <MiniMap 
          nodeColor={(node) => {
            const colors = {
              start: '#10b981',
              input: '#3b82f6',
              api: '#8b5cf6',
              ai: '#ec4899',
              condition: '#f59e0b',
              database: '#06b6d4',
              output: '#f97316',
              end: '#ef4444'
            };
            return colors[node.data?.type] || '#6b7280';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          className="workflow-minimap"
        />
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas;