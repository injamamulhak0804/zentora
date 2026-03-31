import { useEffect, useRef } from "react";
import { Arrow, Line, Rect, Transformer } from "react-konva";

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (!isSelected) return;
    if (!trRef.current || !shapeRef.current) return;
    trRef.current.nodes([shapeRef.current]);
  }, [isSelected]);

  const { width, height, type, opacity } = shapeProps;

  const fill = shapeProps.color ?? shapeProps.fill;
  const stroke = shapeProps.stroke ?? "transparent";
  const strokeWidth = shapeProps.strokeWidth ?? 0;

  const isCircle = type === "circle";
  const cornerRadius = isCircle
    ? Math.min(width, height) / 2
    : (shapeProps.cornerRadius ?? 0);

  const handleDragEnd = (e) => {
    onChange({
      ...shapeProps,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    onChange({
      ...shapeProps,
      x: node.x(),
      y: node.y(),
      // Use original width/height from props; scale is applied on top.
      width: Math.max(5, shapeProps.width * scaleX),
      height: Math.max(5, shapeProps.height * scaleY),
    });
  };

  if (type === "triangle") {
    const points = [width / 2, 0, width, height, 0, height];
    return (
      <>
        <Line
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
          x={shapeProps.x}
          y={shapeProps.y}
          points={points}
          closed
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          draggable
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            flipEnabled={false}
            boundBoxFunc={(oldBox, newBox) => {
              if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                return oldBox;
              }
              return newBox;
            }}
            anchorSize={8}
          />
        )}
      </>
    );
  }

  if (type === "arrow") {
    // Points are relative to the node's origin. We draw an arrow running left -> right.
    const points = [0, height / 2, width, height / 2];
    return (
      <>
        <Arrow
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
          x={shapeProps.x}
          y={shapeProps.y}
          points={points}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          draggable
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            flipEnabled={false}
            boundBoxFunc={(oldBox, newBox) => {
              if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                return oldBox;
              }
              return newBox;
            }}
            anchorSize={8}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        x={shapeProps.x}
        y={shapeProps.y}
        width={width}
        height={height}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        cornerRadius={cornerRadius}
        draggable
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        opacity={opacity}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
          anchorSize={8}
        />
      )}
    </>
  );
};

export default Rectangle;
