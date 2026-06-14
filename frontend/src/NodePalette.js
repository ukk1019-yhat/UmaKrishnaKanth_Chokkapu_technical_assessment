import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import useStore from './store';

const NODE_TYPES = [
  { type: 'input', label: 'Input', icon: 'I', color: '#4f7cff' },
  { type: 'llm', label: 'LLM', icon: 'AI', color: '#a855f7' },
  { type: 'text', label: 'Text', icon: 'T', color: '#34d399' },
  { type: 'note', label: 'Note', icon: 'N', color: '#f59e0b' },
  { type: 'output', label: 'Output', icon: 'O', color: '#f87171' },
];

const NodePalette = () => {
  const addNode = useStore((s) => s.addNode);
  const { screenToFlowPosition } = useReactFlow();

  const handleAdd = useCallback(
    (type, label) => {
      const center = screenToFlowPosition({
        x: window.innerWidth / 2 + Math.random() * 300 - 150,
        y: window.innerHeight / 2 + Math.random() * 300 - 150,
      });
      addNode(type, center, { label, text: '' });
    },
    [addNode, screenToFlowPosition]
  );

  return (
    <div className="palette">
      <div className="palette-title">Nodes</div>
      {NODE_TYPES.map((n) => (
        <button
          key={n.type}
          className="palette-item"
          onClick={() => handleAdd(n.type, n.label)}
          title={`Add ${n.label}`}
        >
          <span className="palette-icon" style={{ background: n.color }}>
            {n.icon}
          </span>
          <span className="palette-label">{n.label}</span>
        </button>
      ))}
    </div>
  );
};

export default NodePalette;
