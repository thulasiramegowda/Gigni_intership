import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { getNodeColor, getNodeIcon } from '../../utils/workflowUtils';

const CustomNode = ({ data, selected, id }) => {
  const color = getNodeColor(data.type);
  const icon = getNodeIcon(data.type);

  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`} style={{ borderColor: color }}>
      <Handle
        type="target"
        position={Position.Top}
        className="handle handle-top"
        style={{ background: color }}
      />
      <div className="node-header" style={{ backgroundColor: color }}>
        <span className="node-icon">{icon}</span>
        <span className="node-title">{data.label || 'Node'}</span>
      </div>
      <div className="node-body">
        <div className="node-type">{data.type}</div>
        <div className="node-description">{data.description || 'No description'}</div>
        {data.config && Object.keys(data.config).length > 0 && (
          <div className="node-config-preview">
            {Object.entries(data.config).slice(0, 2).map(([key, value]) => (
              <div key={key} className="config-item">
                <span className="config-key">{key}:</span>
                <span className="config-value">{typeof value === 'object' ? '...' : String(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="handle handle-bottom"
        style={{ background: color }}
      />
    </div>
  );
};

export default CustomNode;