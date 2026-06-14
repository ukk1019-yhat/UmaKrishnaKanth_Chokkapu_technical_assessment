import BaseNode from './BaseNode';
import useStore from './store';

const IONode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const isInput = data.label === 'Input';
  const fieldName = isInput ? 'inputName' : 'outputName';
  const icon = isInput ? 'I' : 'O';

  return (
    <BaseNode
      id={id}
      data={data}
      title={data.label || (isInput ? 'Input' : 'Output')}
      icon={icon}
      {...(isInput ? { outputs: [{ id: 'value' }] } : { inputs: [{ id: 'value' }] })}
    >
      <div className="node-field">
        <label>Name</label>
        <input
          className="node-input"
          value={data[fieldName] || ''}
          onChange={(e) => updateNodeField(id, fieldName, e.target.value)}
          placeholder={isInput ? 'Input name...' : 'Output name...'}
        />
      </div>
    </BaseNode>
  );
};

export default IONode;
