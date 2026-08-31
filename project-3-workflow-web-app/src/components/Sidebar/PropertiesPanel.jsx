import React from 'react';
import { getNodeColor, getNodeIcon } from '../../utils/workflowUtils';

const PropertiesPanel = ({ selectedNode, onUpdateNode }) => {
  if (!selectedNode) {
    return (
      <div className="properties-panel">
        <div className="panel-empty">
          <div className="empty-icon">📋</div>
          <p>No node selected</p>
          <span>Select a node to view its properties</span>
        </div>
      </div>
    );
  }

  const { data, id } = selectedNode;
  const color = getNodeColor(data.type);
  const icon = getNodeIcon(data.type);

  const handleChange = (field, value) => {
    onUpdateNode(id, { [field]: value });
  };

  const handleConfigChange = (key, value) => {
    onUpdateNode(id, {
      config: { ...data.config, [key]: value }
    });
  };

  return (
    <div className="properties-panel">
      <div className="panel-header">
        <div className="panel-title" style={{ borderLeftColor: color }}>
          <span className="panel-icon" style={{ color }}>{icon}</span>
          <div>
            <h3>Node Properties</h3>
            <span className="node-type-badge" style={{ backgroundColor: color }}>
              {data.type}
            </span>
          </div>
        </div>
      </div>
      
      <div className="panel-body">
        <div className="property-group">
          <label>Node Name</label>
          <input
            type="text"
            value={data.label || ''}
            onChange={(e) => handleChange('label', e.target.value)}
            className="property-input"
            placeholder="Enter node name"
          />
        </div>

        <div className="property-group">
          <label>Description</label>
          <textarea
            value={data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="property-textarea"
            rows="2"
            placeholder="Enter description"
          />
        </div>

        <div className="property-group">
          <label>Type</label>
          <input
            type="text"
            value={data.type || ''}
            disabled
            className="property-input disabled"
          />
        </div>

        {data.config && Object.keys(data.config).length > 0 && (
          <div className="property-group config-section">
            <label>⚙️ Configuration</label>
            {Object.entries(data.config).map(([key, value]) => (
              <div key={key} className="config-field">
                <span className="config-label">{key}</span>
                {typeof value === 'boolean' ? (
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleConfigChange(key, e.target.checked)}
                    className="config-checkbox"
                  />
                ) : (
                  <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => handleConfigChange(key, e.target.value)}
                    className="property-input config-input"
                    placeholder={`Enter ${key}`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="property-group node-info">
          <label>Node ID</label>
          <span className="node-id">{id}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;