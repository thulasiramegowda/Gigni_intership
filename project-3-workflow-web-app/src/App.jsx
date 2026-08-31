import React, { useState, useRef, useCallback } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { useWorkflow } from './hooks/useWorkflow';
import WorkflowCanvas from './components/Canvas/WorkflowCanvas';
import NodePalette from './components/Sidebar/NodePalette';
import PropertiesPanel from './components/Sidebar/PropertiesPanel';
import Toolbar from './components/Toolbar/Toolbar';
import JSONViewer from './components/JSONViewer/JSONViewer';
import { exportWorkflow, importWorkflow } from './utils/storage';

function App() {
  const {
    nodes,
    edges,
    selectedNode,
    workflowName,
    setWorkflowName,
    error,
    setError,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onPaneClick,
    addNode,
    deleteSelectedNode,
    updateNodeData,
    clearWorkflow,
    undo,
    redo,
    loadSample,
    exportWorkflow: exportWorkflowData,
    saveWorkflow: saveWorkflowData
  } = useWorkflow();

  const [showJSONViewer, setShowJSONViewer] = useState(false);
  const [canUndo, setCanUndo] = useState(true);
  const [canRedo, setCanRedo] = useState(false);
  const reactFlowRef = useRef();

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Delete key to remove selected node
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNode) {
        deleteSelectedNode();
      }
      // Ctrl+Z for undo
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      // Ctrl+Y for redo
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
      }
      // Ctrl+S for save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveWorkflowData();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, deleteSelectedNode, undo, redo, saveWorkflowData]);

  const handleExport = () => {
    const data = {
      nodes,
      edges,
      name: workflowName,
      exportedAt: new Date().toISOString()
    };
    exportWorkflow(data);
  };

  const handleImport = async (file) => {
    try {
      const data = await importWorkflow(file);
      // Validate imported data
      if (data.nodes && data.edges) {
        // Replace current workflow
        setNodes(data.nodes);
        setEdges(data.edges);
        if (data.name) {
          setWorkflowName(data.name);
        }
        setError(null);
      } else {
        throw new Error('Invalid workflow data');
      }
    } catch (err) {
      setError('Failed to import workflow: ' + err.message);
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleFitView = () => {
    if (reactFlowRef.current) {
      reactFlowRef.current.fitView({ padding: 0.2 });
    }
  };

  const handleZoomIn = () => {
    if (reactFlowRef.current) {
      const zoom = reactFlowRef.current.getZoom();
      reactFlowRef.current.setZoom(zoom * 1.2);
    }
  };

  const handleZoomOut = () => {
    if (reactFlowRef.current) {
      const zoom = reactFlowRef.current.getZoom();
      reactFlowRef.current.setZoom(zoom / 1.2);
    }
  };

  const handleReset = () => {
    loadSample();
  };

  // Create a wrapper to pass reactFlow instance
  const onInit = (reactFlowInstance) => {
    reactFlowRef.current = reactFlowInstance;
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>⚡ Workflow Visualizer</h1>
          <span className="header-subtitle">Project 3 · Gigni Internship</span>
        </div>
        <div className="header-right">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="workflow-name-input"
            placeholder="Workflow Name"
          />
          <button 
            className="json-toggle-btn"
            onClick={() => setShowJSONViewer(!showJSONViewer)}
          >
            {showJSONViewer ? '📊 Hide JSON' : '📊 View JSON'}
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <Toolbar
        onAddNode={() => {
          // Show node palette or add default node
          const types = ['input', 'api', 'ai', 'condition', 'database', 'output'];
          const randomType = types[Math.floor(Math.random() * types.length)];
          addNode(randomType);
        }}
        onSave={saveWorkflowData}
        onExport={handleExport}
        onImport={handleImport}
        onUndo={undo}
        onRedo={redo}
        onFitView={handleFitView}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        onClear={clearWorkflow}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <div className="app-body">
        <div className="sidebar-left">
          <NodePalette onAddNode={addNode} />
          <div className="sidebar-actions">
            <button className="sidebar-action-btn" onClick={handleReset}>
              🔄 Load Sample
            </button>
            <button className="sidebar-action-btn" onClick={clearWorkflow}>
              🗑️ Clear All
            </button>
          </div>
        </div>

        <div className="canvas-wrapper">
          <ReactFlowProvider>
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onInit={onInit}
              selectedNode={selectedNode}
            />
          </ReactFlowProvider>
          <div className="canvas-stats">
            <span>Nodes: {nodes.length}</span>
            <span>Connections: {edges.length}</span>
          </div>
        </div>

        <div className="sidebar-right">
          <PropertiesPanel 
            selectedNode={selectedNode} 
            onUpdateNode={updateNodeData}
          />
        </div>
      </div>

      {showJSONViewer && (
        <JSONViewer
          nodes={nodes}
          edges={edges}
          workflowName={workflowName}
          onClose={() => setShowJSONViewer(false)}
        />
      )}
    </div>
  );
}

export default App;