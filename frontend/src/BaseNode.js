import { Handle, Position, useReactFlow } from '@xyflow/react';
import './nodes.css';

const BaseNode = ({ id, title, icon, inputs = [], outputs = [], children }) => {
  const { deleteElements } = useReactFlow();

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <div className="base-node">
      <div className="base-node-header">
        {icon && <span className="base-node-icon">{icon}</span>}
        <span className="base-node-title">{title}</span>
        <button className="node-delete-btn" onClick={handleDelete} title="Delete node">&times;</button>
      </div>
      <div className="base-node-body">{children}</div>
      {inputs.map((handle, idx) => (
        <Handle
          key={`input-${idx}`}
          type="target"
          position={Position.Left}
          id={handle.id || `input-${idx}`}
          style={{ top: handle.top || `${((idx + 1) / (inputs.length + 1)) * 100}%` }}
          className="custom-handle"
        />
      ))}
      {outputs.map((handle, idx) => (
        <Handle
          key={`output-${idx}`}
          type="source"
          position={Position.Right}
          id={handle.id || `output-${idx}`}
          style={{ top: handle.top || `${((idx + 1) / (outputs.length + 1)) * 100}%` }}
          className="custom-handle"
        />
      ))}
    </div>
  );
};

export default BaseNode;
