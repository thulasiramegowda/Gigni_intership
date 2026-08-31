import { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, addEdge } from 'react-flow-renderer';
import { createNode, validateNodeConnection } from '../utils/workflowUtils';
import { saveWorkflow, loadWorkflow } from '../utils/storage';
import { getSampleWorkflow } from '../sampleWorkflow';

export const useWorkflow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Load saved workflow or sample on mount
  useEffect(() => {
    const savedWorkflow = loadWorkflow();
    if (savedWorkflow && savedWorkflow.nodes && savedWorkflow.edges) {
      setNodes(savedWorkflow.nodes);
      setEdges(savedWorkflow.edges);
      setWorkflowName(savedWorkflow.name || 'Untitled Workflow');
    } else {
      const sample = getSampleWorkflow();
      setNodes(sample.nodes);
      setEdges(sample.edges);
    }
    setIsLoading(false);
  }, []);

  // Save workflow on changes
  useEffect(() => {
    if (!isLoading) {
      const workflowData = {
        nodes,
        edges,
        name: workflowName,
        lastModified: new Date().toISOString()
      };
      saveWorkflow(workflowData);
    }
  }, [nodes, edges, workflowName, isLoading]);

  // Track history for undo/redo
  useEffect(() => {
    if (!isLoading && nodes.length > 0) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [nodes, edges]);

  const onConnect = useCallback((params) => {
    const sourceNode = nodes.find(n => n.id === params.source);
    const targetNode = nodes.find(n => n.id === params.target);
    
    if (!sourceNode || !targetNode) return;

    const validation = validateNodeConnection(sourceNode, targetNode, edges);
    if (!validation.valid) {
      setError(validation.message);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#6366f1' }
    }, eds));
  }, [nodes, edges, setEdges]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const addNode = useCallback((type) => {
    const position = { 
      x: 100 + Math.random() * 300, 
      y: 100 + Math.random() * 300 
    };
    const newNode = createNode(type, position);
    setNodes((nds) => [...nds, newNode]);
    setSelectedNode(newNode);
  }, [setNodes]);

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNode) return;
    
    setNodes((nds) => nds.filter(node => node.id !== selectedNode.id));
    setEdges((eds) => eds.filter(edge => 
      edge.source !== selectedNode.id && edge.target !== selectedNode.id
    ));
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) => nds.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            ...newData
          }
        };
      }
      return node;
    }));
  }, [setNodes]);

  const clearWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setWorkflowName('Untitled Workflow');
  }, [setNodes, setEdges]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      if (state) {
        setNodes(state.nodes);
        setEdges(state.edges);
        setHistoryIndex(newIndex);
      }
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      if (state) {
        setNodes(state.nodes);
        setEdges(state.edges);
        setHistoryIndex(newIndex);
      }
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const loadSample = useCallback(() => {
    const sample = getSampleWorkflow();
    setNodes(sample.nodes);
    setEdges(sample.edges);
    setSelectedNode(null);
    setWorkflowName('Sample Workflow');
  }, [setNodes, setEdges]);

  const exportWorkflowData = useCallback(() => {
    return {
      nodes,
      edges,
      name: workflowName,
      exportedAt: new Date().toISOString()
    };
  }, [nodes, edges, workflowName]);

  return {
    nodes,
    edges,
    selectedNode,
    workflowName,
    setWorkflowName,
    isLoading,
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
    saveWorkflow: () => saveWorkflow({ nodes, edges, name: workflowName })
  };
};