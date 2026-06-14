import useStore from './store';
import BaseNode from './BaseNode';

const NoteNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Note"
      icon="N"
      inputs={[{ id: 'trigger' }]}
      outputs={[{ id: 'done' }]}
    >
      <textarea
        className="node-textarea"
        value={data.text || ''}
        onChange={(e) => updateNodeField(id, 'text', e.target.value)}
        placeholder="Write a note..."
        rows={3}
      />
    </BaseNode>
  );
};

export default NoteNode;
