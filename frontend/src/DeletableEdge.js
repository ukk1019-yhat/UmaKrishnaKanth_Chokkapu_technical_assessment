import { BaseEdge, getBezierPath } from '@xyflow/react';

const DeletableEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      className={`custom-edge ${selected ? 'custom-edge-selected' : ''}`}
    />
  );
};

export default DeletableEdge;
