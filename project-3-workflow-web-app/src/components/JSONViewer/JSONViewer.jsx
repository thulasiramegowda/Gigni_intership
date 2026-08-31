import React, { useState } from 'react';

const JSONViewer = ({ nodes, edges, workflowName, onClose }) => {
  const [copied, setCopied] = useState(false);

  const workflowData = {
    name: workflowName,
    nodes: nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data
    })),
    edges: edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label || null
    })),
    metadata: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      exportedAt: new Date().toISOString()
    }
  };

  const jsonString = JSON.stringify(workflowData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="json-viewer-overlay" onClick={onClose}>
      <div className="json-viewer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="json-viewer-header">
          <h3>📊 Workflow JSON</h3>
          <div className="json-actions">
            <button className="json-action-btn" onClick={handleCopy}>
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
            <button className="json-action-btn close-btn" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="json-viewer-content">
          <pre className="json-code">
            <code>{jsonString}</code>
          </pre>
        </div>
        <div className="json-viewer-footer">
          <span className="json-stats">
            {nodes.length} nodes · {edges.length} connections
          </span>
        </div>
      </div>
    </div>
  );
};

export default JSONViewer;