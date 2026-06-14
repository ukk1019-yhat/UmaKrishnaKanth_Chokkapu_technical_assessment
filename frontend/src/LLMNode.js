import BaseNode from './BaseNode';
import useStore from './store';

const LLMNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  return (
    <BaseNode
      id={id}
      data={data}
      title="LLM"
      icon="AI"
      inputs={[{ id: 'system', top: '30%' }, { id: 'prompt', top: '70%' }]}
      outputs={[{ id: 'response' }]}
    >
      <div className="node-field">
        <label>System</label>
        <input
          className="node-input"
          value={data.system || ''}
          onChange={(e) => updateNodeField(id, 'system', e.target.value)}
          placeholder="System prompt..."
        />
      </div>
      <div className="node-field">
        <label>Prompt</label>
        <input
          className="node-input"
          value={data.prompt || ''}
          onChange={(e) => updateNodeField(id, 'prompt', e.target.value)}
          placeholder="User prompt..."
        />
      </div>
    </BaseNode>
  );
};

export default LLMNode;
