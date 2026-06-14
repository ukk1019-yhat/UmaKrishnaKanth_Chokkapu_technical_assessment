import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';

const initialNodes = [
  { id: '1', type: 'input', position: { x: 100, y: 200 }, data: { label: 'Input' } },
  { id: '2', type: 'llm', position: { x: 400, y: 200 }, data: { label: 'LLM' } },
  { id: '3', type: 'text', position: { x: 400, y: 400 }, data: { label: 'Text', text: '' } },
  { id: '4', type: 'output', position: { x: 700, y: 200 }, data: { label: 'Output' } },
  { id: '5', type: 'note', position: { x: 100, y: 400 }, data: { label: 'Note', text: '' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', sourceHandle: 'value', target: '2', targetHandle: 'system' },
  { id: 'e2-4', source: '2', sourceHandle: 'response', target: '4', targetHandle: 'value' },
];

const useStore = create((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) =>
    set({ edges: addEdge(connection, get().edges) }),

  updateNodeField: (nodeId, fieldName, value) =>
    set({
      nodes: get().nodes.map((node) => {
        if (node.id !== nodeId) return node;
        return { ...node, data: { ...node.data, [fieldName]: value } };
      }),
    }),

  addNode: (type, position, data) =>
    set({ nodes: [...get().nodes, { id: `${type}-${Date.now()}`, type, position, data }] }),
}));

export default useStore;
