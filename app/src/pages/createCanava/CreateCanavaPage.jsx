import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Layer,
  Line,
  Rect,
  Text,
  Stage,
  Image as KonvaImage,
  Transformer,
} from "react-konva";
import { FaRegSquare } from "react-icons/fa";
import { GoCircle } from "react-icons/go";
import { LuImagePlus } from "react-icons/lu";
import { TfiText } from "react-icons/tfi";
import Rectangle from "../../component/Canva/Rectangle";
import useImage from "use-image";
import { addShape } from "../../helper";
import { IoTriangleOutline } from "react-icons/io5";
import { GoArrowUpRight } from "react-icons/go";

function GridLayer({
  width,
  height,
  gridSize = 10,
  majorEvery = 5,
  minorColor = "rgba(0,0,0,0.04)",
  majorColor = "rgba(0,0,0,0.06)",
}) {
  const lines = useMemo(() => {
    const out = [];
    if (!width || !height || gridSize <= 0) return out;

    const vCount = Math.ceil(width / gridSize);
    const hCount = Math.ceil(height / gridSize);

    for (let i = 0; i <= vCount; i += 1) {
      const x = i * gridSize;
      const isMajor = majorEvery > 0 && i % majorEvery === 0;
      out.push(
        <Line
          key={`v-${i}`}
          points={[x, 0, x, height]}
          stroke={isMajor ? majorColor : minorColor}
          strokeWidth={1}
          perfectDrawEnabled={false}
        />,
      );
    }

    for (let i = 0; i <= hCount; i += 1) {
      const y = i * gridSize;
      const isMajor = majorEvery > 0 && i % majorEvery === 0;
      out.push(
        <Line
          key={`h-${i}`}
          points={[0, y, width, y]}
          stroke={isMajor ? majorColor : minorColor}
          strokeWidth={1}
          perfectDrawEnabled={false}
        />,
      );
    }

    return out;
  }, [width, height, gridSize, majorEvery, minorColor, majorColor]);

  return (
    <Layer listening={false} hitGraphEnabled={false}>
      {lines}
    </Layer>
  );
}

const TextArea = ({ textNode, onClose, onChange, stageRef }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current || !textNode || !stageRef.current) return;

    const textarea = textareaRef.current;
    const stage = stageRef.current;
    const textPosition = textNode.absolutePosition();
    const stageBox = stage.container().getBoundingClientRect();

    textarea.value = textNode.text();
    textarea.style.position = "fixed";
    textarea.style.top = `${stageBox.top + textPosition.y}px`;
    textarea.style.left = `${stageBox.left + textPosition.x}px`;
    textarea.style.width = `${textNode.width() - textNode.padding() * 2}px`;
    textarea.style.height = `${textNode.height() - textNode.padding() * 2 + 5}px`;
    textarea.style.fontSize = `${textNode.fontSize()}px`;
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill().toString() || "#000";

    const rotation = textNode.rotation();
    textarea.style.transform = rotation ? `rotateZ(${rotation}deg)` : "";

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 3}px`;

    textarea.focus();

    const handleOutsideClick = (e) => {
      if (e.target !== textarea) {
        onChange(textarea.value);
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onChange(textarea.value);
        onClose();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleInput = () => {
      const scale = textNode.getAbsoluteScale().x;
      textarea.style.width = `${textNode.width() * scale}px`;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight + textNode.fontSize()}px`;
    };

    textarea.addEventListener("keydown", handleKeyDown);
    textarea.addEventListener("input", handleInput);

    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    }, 0);

    return () => {
      textarea.removeEventListener("keydown", handleKeyDown);
      textarea.removeEventListener("input", handleInput);
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [textNode, onChange, onClose, stageRef]);

  return (
    <textarea
      ref={textareaRef}
      style={{
        minHeight: "1em",
        position: "fixed",
        zIndex: 1000,
      }}
    />
  );
};

const TextEditor = ({ textNode, onClose, onChange, stageRef }) => {
  if (!textNode) return null;
  return (
    <TextArea
      textNode={textNode}
      onClose={onClose}
      onChange={onChange}
      stageRef={stageRef}
    />
  );
};

const TextItem = ({ shapeProps, isSelected, onSelect, onChange, onEdit, isEditing }) => {
  const shapeRef = useRef(null);
  const trRef = useRef(null);

  useEffect(() => {
    if (!isSelected || !trRef.current || !shapeRef.current) return;
    trRef.current.nodes([shapeRef.current]);
    trRef.current.getLayer()?.batchDraw();
  }, [isSelected]);

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
    const newWidth = Math.max(30, node.width() * scaleX);

    node.scaleX(1);

    onChange({
      ...shapeProps,
      x: node.x(),
      y: node.y(),
      width: newWidth,
    });
  };

  return (
    <>
      <Text
        ref={shapeRef}
        x={shapeProps.x}
        y={shapeProps.y}
        text={shapeProps.text}
        width={shapeProps.width}
        fontSize={shapeProps.fontSize}
        fontFamily={shapeProps.fontFamily || "Arial"}
        fill={shapeProps.fill || shapeProps.color || "#000"}
        draggable
        visible={!isEditing}
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={() => onEdit(shapeRef.current)}
        onDblTap={() => onEdit(shapeRef.current)}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        align={shapeProps.align || "left"}
        lineHeight={shapeProps.lineHeight || 1.2}
      />
      {isSelected && !isEditing && (
        <Transformer
          ref={trRef}
          enabledAnchors={["middle-left", "middle-right"]}
          boundBoxFunc={(oldBox, newBox) => ({
            ...newBox,
            width: Math.max(30, newBox.width),
          })}
          rotateEnabled={false}
        />
      )}
    </>
  );
};

function CreateCanavaPage({
  color,
  rectangles,
  setRectangles,
  SetSelectedCom,
  checkDeselect,
  selectedId,
  selectShape,
  stageRef,
  images,
  setImages,
}) {
  const containerRef = useRef(null);
  const [stageSize, setStageSize] = useState({
    width: 0,
    height: 0,
  });

  const [newRect, setNewRect] = useState(null);
  const [editingTextId, setEditingTextId] = useState(null);
  const [editingTextNode, setEditingTextNode] = useState(null);

  useLayoutEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      const height = entries[0].contentRect.height;
      setStageSize({
        width,
        height: height,
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePointerDown = (e) => {
    // Only draw if clicking empty area
    if (e.target !== e.target.getStage()) return;
    SetSelectedCom(null);
    selectShape(null);

    const stage = stageRef.current;
    const pos = stage.getPointerPosition();
    if (!pos) return;

    setNewRect({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      color,
      id: crypto.randomUUID(),
    });
  };

  const handlePointerMove = () => {
    const stage = stageRef.current;
    const pos = stage.getPointerPosition();
    if (!pos) return;

    setNewRect((prev) => {
      if (!prev) return prev;
      const width = pos.x - prev.x;
      const height = pos.y - prev.y;

      return {
        x: width < 0 ? pos.x : prev.x,
        y: height < 0 ? pos.y : prev.y,
        width: Math.abs(width),
        height: Math.abs(height),
        color: prev.color,
        id: prev.id,
        stroke: "transparent",
        strokeWidth: 0,
      };
    });
  };

  const handlePointerUp = () => {
    if (newRect && newRect.width > 2 && newRect.height > 2) {
      setRectangles((prev) => [...prev, newRect]);
      SetSelectedCom(newRect.id);
      selectShape(newRect.id);
    }
    setNewRect(null);
  };

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        src: url,
        x: 100,
        y: 100,
        width: 600,
        height: 400,
      },
    ]);
  };

  const URLImage = ({ image, isSelected, onSelect, onChange }) => {
    const shapeRef = useRef(null);
    const trRef = useRef(null);

    const [loadedImage] = useImage(image.src, "anonymous");

    useEffect(() => {
      if (!isSelected) return;
      if (!trRef.current || !shapeRef.current) return;
      trRef.current.nodes([shapeRef.current]);
    }, [isSelected]);

    if (!loadedImage) return null;

    return (
      <>
        <KonvaImage
          ref={shapeRef}
          image={loadedImage}
          x={image.x}
          y={image.y}
          width={image.width}
          height={image.height}
          draggable
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) => {
            onChange({
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={() => {
            const node = shapeRef.current;
            if (!node) return;

            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);

            onChange({
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
            });
          }}
        />

        {isSelected && (
          <Transformer
            ref={trRef}
            flipEnabled={false}
            rotateEnabled={false}
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

  return (
    <>
      <div ref={containerRef} className="h-full min-w-0 bg-[#f5f5f5] relative">
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onMouseDown={(e) => {
            if (editingTextId) return;
            checkDeselect(e);
            handlePointerDown(e);
          }}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={(e) => {
            if (editingTextId) return;
            checkDeselect(e);
            handlePointerDown(e);
          }}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          <GridLayer width={stageSize.width} height={stageSize.height} />
          <Layer>
            {rectangles.map((rect, i) => {
              if (rect.type === "text") {
                return (
                  <TextItem
                    key={rect.id}
                    shapeProps={rect}
                    isSelected={rect.id === selectedId}
                    isEditing={editingTextId === rect.id}
                    onSelect={() => {
                      SetSelectedCom(rect.id);
                      selectShape(rect.id);
                    }}
                    onChange={(newAttrs) => {
                      const rects = rectangles.slice();
                      rects[i] = newAttrs;
                      setRectangles(rects);
                    }}
                    onEdit={(node) => {
                      setEditingTextId(rect.id);
                      setEditingTextNode(node);
                      SetSelectedCom(rect.id);
                      selectShape(rect.id);
                    }}
                  />
                );
              }

              return (
                <Rectangle
                  key={rect.id}
                  shapeProps={rect}
                  isSelected={rect.id === selectedId}
                  onSelect={() => {
                    SetSelectedCom(rect.id);
                    selectShape(rect.id);
                  }}
                  onChange={(newAttrs) => {
                    const rects = rectangles.slice();
                    rects[i] = newAttrs;
                    setRectangles(rects);
                  }}
                />
              );
            })}

            {images.map((image) => (
              <URLImage
                key={image.id}
                image={image}
                isSelected={image.id === selectedId}
                onSelect={() => {
                  SetSelectedCom(image.id);
                  selectShape(image.id);
                }}
                onChange={(patch) => {
                  setImages((prev) =>
                    prev.map((img) =>
                      img.id === image.id ? { ...img, ...patch } : img,
                    ),
                  );
                }}
              />
            ))}

            {newRect && (
              <Rect
                {...newRect}
                fill="rgba(119, 130, 237, 0.4)"
                stroke="rgba(119, 130, 237, 1)"
                strokeWidth={1}
              />
            )}
          </Layer>
        </Stage>

        {editingTextId && editingTextNode && (
          <TextEditor
            textNode={editingTextNode}
            stageRef={stageRef}
            onChange={(newText) => {
              setRectangles((prev) =>
                prev.map((item) =>
                  item.id === editingTextId ? { ...item, text: newText } : item,
                ),
              );
            }}
            onClose={() => {
              setEditingTextId(null);
              setEditingTextNode(null);
            }}
          />
        )}

        {/* Controls */}
        <div className="absolute bottom-10 left-1/2 transform flex -translate-x-1/2 items-center gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer rounded-md bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
          >
            <LuImagePlus size={18} />
          </label>
          <div
            className="cursor-pointer rounded-md bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
            onClick={() => addShape("text", color, setRectangles)}
          >
            <TfiText size={18} />
          </div>
          <div
            className="cursor-pointer rounded-md bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
            onClick={() => addShape("rect", color, setRectangles)}
          >
            <FaRegSquare size={18} />
          </div>
          <div
            className="cursor-pointer rounded-md bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
            onClick={() => addShape("circle", color, setRectangles)}
          >
            <GoCircle size={18} />
          </div>
          <div
            className="cursor-pointer rounded-md bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
            onClick={() => addShape("triangle", color, setRectangles)}
          >
            {/* <span className="text-sm font-bold leading-none"> */}
            <IoTriangleOutline />
            {/* </span> */}
          </div>
          <div
            className="cursor-pointer rounded-md bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
            onClick={() => addShape("arrow", color, setRectangles)}
          >
            {/* <span className="text-sm font-bold leading-none"> */}
            <GoArrowUpRight />
            {/* </span> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateCanavaPage;
