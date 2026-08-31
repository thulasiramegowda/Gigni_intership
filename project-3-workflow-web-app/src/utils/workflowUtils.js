import { v4 as uuidv4 } from 'uuid';

export const createNode = (type, position = { x: 100, y: 100 }) => {
  const nodeTypes = {
    start: { label: 'Start', description: 'Workflow starts here', config: {} },
    input: { label: 'Input', description: 'Collect input data', config: { inputType: 'text', required: true } },
    api: { label: 'API Request', description: 'Make an API call', config: { method: 'GET', url: '', headers: {} } },
    ai: { label: 'AI Processing', description: 'Process with AI', config: { model: 'GPT-4', temperature: 0.7 } },
    condition: { label: 'Condition', description: 'Check condition', config: { condition: '', truePath: '', falsePath: '' } },
    database: { label: 'Database', description: 'Database operation', config: { table: '', operation: 'select' } },
    output: { label: 'Output', description: 'Generate output', config: { format: 'json' } },
    end: { label: 'End', description: 'Workflow ends here', config: {} }
  };

  const defaultData = nodeTypes[type] || nodeTypes.input;
  
  return {
    id: `${type}-${uuidv4().slice(0, 8)}`,
    type: type,
    position: position,
    data: {
      label: defaultData.label,
      description: defaultData.description,
      type: type,
      config: { ...defaultData.config }
    }
  };
};

export const validateNodeConnection = (sourceNode, targetNode, existingEdges) => {
  // Prevent self-connection
  if (sourceNode.id === targetNode.id) {
    return { valid: false, message: 'Cannot connect node to itself' };
  }

  // Prevent duplicate connections
  const alreadyConnected = existingEdges.some(
    edge => edge.source === sourceNode.id && edge.target === targetNode.id
  );
  
  if (alreadyConnected) {
    return { valid: false, message: 'These nodes are already connected' };
  }

  return { valid: true };
};

export const getNodeColor = (type) => {
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
  return colors[type] || '#6b7280';
};

export const getNodeIcon = (type) => {
  const icons = {
    start: '▶',
    input: '⌨',
    api: '🌐',
    ai: '🧠',
    condition: '⚡',
    database: '🗄',
    output: '📤',
    end: '⏹'
  };
  return icons[type] || '📦';
};

export const formatJSON = (data) => {
  return JSON.stringify(data, null, 2);
};

export const parseJSON = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};