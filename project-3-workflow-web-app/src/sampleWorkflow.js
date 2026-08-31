export const getSampleWorkflow = () => {
  const nodes = [
    {
      id: 'start-1',
      type: 'start',
      position: { x: 250, y: 25 },
      data: { 
        label: 'Start', 
        description: 'Workflow begins here',
        type: 'start',
        config: {}
      }
    },
    {
      id: 'input-1',
      type: 'input',
      position: { x: 250, y: 125 },
      data: { 
        label: 'User Input', 
        description: 'Collect user data',
        type: 'input',
        config: { 
          inputType: 'text',
          required: true
        }
      }
    },
    {
      id: 'ai-1',
      type: 'ai',
      position: { x: 250, y: 225 },
      data: { 
        label: 'AI Processing', 
        description: 'Process with AI model',
        type: 'ai',
        config: { 
          model: 'GPT-4',
          temperature: 0.7,
          maxTokens: 1000
        }
      }
    },
    {
      id: 'condition-1',
      type: 'condition',
      position: { x: 250, y: 325 },
      data: { 
        label: 'Condition Check', 
        description: 'Check if condition is met',
        type: 'condition',
        config: { 
          condition: 'response.isValid',
          truePath: 'Database',
          falsePath: 'Output'
        }
      }
    },
    {
      id: 'database-1',
      type: 'database',
      position: { x: 100, y: 425 },
      data: { 
        label: 'Save to Database', 
        description: 'Store results in database',
        type: 'database',
        config: { 
          table: 'results',
          operation: 'insert'
        }
      }
    },
    {
      id: 'output-1',
      type: 'output',
      position: { x: 400, y: 425 },
      data: { 
        label: 'Generate Output', 
        description: 'Generate final output',
        type: 'output',
        config: { 
          format: 'json',
          includeMetadata: true
        }
      }
    },
    {
      id: 'end-1',
      type: 'end',
      position: { x: 250, y: 525 },
      data: { 
        label: 'End', 
        description: 'Workflow complete',
        type: 'end',
        config: {}
      }
    }
  ];

  const edges = [
    {
      id: 'e1-2',
      source: 'start-1',
      target: 'input-1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#6366f1' }
    },
    {
      id: 'e2-3',
      source: 'input-1',
      target: 'ai-1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#6366f1' }
    },
    {
      id: 'e3-4',
      source: 'ai-1',
      target: 'condition-1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#6366f1' }
    },
    {
      id: 'e4-5',
      source: 'condition-1',
      target: 'database-1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#6366f1' },
      label: 'True'
    },
    {
      id: 'e4-6',
      source: 'condition-1',
      target: 'output-1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#6366f1' },
      label: 'False'
    },
    {
      id: 'e5-7',
      source: 'database-1',
      target: 'end-1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#6366f1' }
    },
    {
      id: 'e6-7',
      source: 'output-1',
      target: 'end-1',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#6366f1' }
    }
  ];

  return { nodes, edges };
};