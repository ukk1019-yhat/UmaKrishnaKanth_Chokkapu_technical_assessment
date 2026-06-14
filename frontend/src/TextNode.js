import { useState, useEffect, useCallback, useRef } from 'react';
import BaseNode from './BaseNode';
import useStore from './store';

const VARIABLE_REGEX = /\{\{\s*(\w+)\s*\}\}/g;

const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const [dynamicInputs, setDynamicInputs] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 200, height: 80 });
  const textareaRef = useRef(null);

  const extractVariables = useCallback((text) => {
    const vars = new Set();
    let match;
    VARIABLE_REGEX.lastIndex = 0;
    while ((match = VARIABLE_REGEX.exec(text)) !== null) {
      vars.add(match[1]);
    }
    return Array.from(vars);
  }, []);

  useEffect(() => {
    const vars = extractVariables(data.text || '');
    setDynamicInputs(
      vars.map((v) => ({ id: `var-${v}`, label: v }))
    );

    const lines = (data.text || '').split('\n');
    const lineCount = Math.max(lines.length, 1);
    const longestLine = lines.reduce((max, l) => Math.max(max, l.length), 0);
    setDimensions({
      width: Math.max(200, Math.min(longestLine * 8 + 32, 400)),
      height: Math.max(80, Math.min(lineCount * 24 + 48, 300)),
    });
  }, [data.text, extractVariables]);

  const handleChange = (e) => {
    updateNodeField(id, 'text', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      data={data}
      title="Text"
      icon="T"
      inputs={dynamicInputs.length > 0 ? dynamicInputs : [{ id: 'default' }]}
      outputs={[{ id: 'output' }]}
    >
      <textarea
        ref={textareaRef}
        className="node-textarea"
        value={data.text || ''}
        onChange={handleChange}
        placeholder={"Type {{ variable }}..."}
        style={{
          width: `${dimensions.width - 32}px`,
          height: `${dimensions.height - 48}px`,
          minWidth: '148px',
          minHeight: '32px',
        }}
      />
    </BaseNode>
  );
};

export default TextNode;
