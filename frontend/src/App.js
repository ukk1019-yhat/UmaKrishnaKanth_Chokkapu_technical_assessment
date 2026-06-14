import { useState, useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import useStore from './store';
import IONode from './IONode';
import LLMNode from './LLMNode';
import TextNode from './TextNode';
import NoteNode from './NoteNode';
import NodePalette from './NodePalette';
import DeletableEdge from './DeletableEdge';
import './nodes.css';

const nodeTypes = {
  input: IONode,
  output: IONode,
  llm: LLMNode,
  text: TextNode,
  note: NoteNode,
};

const edgeTypes = {
  default: DeletableEdge,
};

const cleanNodes = (nodes) =>
  nodes.map(({ id, type, position, data }) => ({ id, type, position, data }));

const cleanEdges = (edges) =>
  edges.map(({ id, source, target, sourceHandle, targetHandle }) => ({
    id, source, target, sourceHandle, targetHandle,
  }));

const App = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodes: cleanNodes(nodes),
          edges: cleanEdges(edges),
        }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  }, [nodes, edges]);

  return (
    <div className="app-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ selectable: true, animated: true }}
        deleteKeyCode={['Delete', 'Backspace']}
        fitView
      >
        <Background color="#2d3a4a" gap={20} />
        <Controls />
        <MiniMap
          style={{ background: '#1c2536' }}
          nodeColor="#4f7cff"
          maskColor="rgba(15, 23, 41, 0.8)"
        />
        <NodePalette />
      </ReactFlow>
      <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Parsing...' : 'Submit Pipeline'}
      </button>

      {result && (
        <div className="result-panel">
          <button className="result-close" onClick={() => setResult(null)}>
            &times;
          </button>
          {result.error ? (
            <p className="result-error">Error: {result.error}</p>
          ) : (
            <>
              <div className="result-title">Pipeline Summary</div>
              <div className="result-row">
                <span>Nodes</span>
                <span className="result-value">{result.num_nodes}</span>
              </div>
              <div className="result-row">
                <span>Edges</span>
                <span className="result-value">{result.num_edges}</span>
              </div>
              <div className="result-row">
                <span>Is DAG</span>
                <span className={`result-value ${result.is_dag ? 'dag-yes' : 'dag-no'}`}>
                  {result.is_dag ? 'Yes' : 'No'}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
