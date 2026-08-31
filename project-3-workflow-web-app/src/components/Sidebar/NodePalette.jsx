import React from 'react';
import { getNodeColor, getNodeIcon } from '../../utils/workflowUtils';

const nodeTypes = [
  { type: 'start', label: 'Start' },
  { type: 'input', label: 'Input' },
  { type: 'api', label: 'API Request' },
  { type: 'ai', label: 'AI Processing' },
  { type: 'condition', label: 'Condition' },
  { type: 'database', label: 'Database' },
  { type: 'output', label: 'Output' },
  { type: 'end', label: 'End' }
];

const NodePalette = ({ onAddNode }) => {
  return (
    <div className="node-palette">
      <div className="palette-header">
        <h3>📦 Node Palette</h3>
        <span className="palette-hint">Click to add</span>
      </div>
      <div className="palette-items">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className="palette-item"
            onClick={() => onAddNode(node.type)}
            style={{ borderLeftColor: getNodeColor(node.type) }}
          >
            <span className="palette-icon" style={{ color: getNodeColor(node.type) }}>
              {getNodeIcon(node.type)}
            </span>
            <div className="palette-info">
              <div className="palette-label">{node.label}</div>
              <div className="palette-type">{node.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodePalette;