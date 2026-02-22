import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Circle, Layer, Rect, Stage } from "react-konva";

function CreateCanavaPage({
  color,
  rectangles,
  setRectangles,
  selectedCom,
  SetSelectedCom,
}) {
  const containerRef = useRef(null);
  const [stageSize, setStageSize] = useState({
    width: 0,
    height: 0,
  });
  const stageRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [newRect, setNewRect] = useState(null);

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

    const stage = stageRef.current;
    const pos = stage.getPointerPosition();
    // console.log("🚀 ~ handlePointerDown ~ pos:", pos);
    setIsDrawing(true);

    setNewRect({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
    });
  };

  const handlePointerMove = () => {
    if (!isDrawing) return;

    const stage = stageRef.current;
    const pos = stage.getPointerPosition();
    const uniqueId = crypto.randomUUID();
    // console.log("🚀 ~ handlePointerMove ~ pos:", pos);

    setNewRect((prev) => {
      const width = pos.x - prev.x;
      // console.log("🚀 ~ handlePointerMove ~ width:", pos.x - prev.x);
      const height = pos.y - prev.y;
      // console.log("🚀 ~ handlePointerMove ~ height:", height);

      return {
        x: width < 0 ? pos.x : prev.x,
        y: height < 0 ? pos.y : prev.y,
        width: Math.abs(width),
        height: Math.abs(height),
        color,
        id: uniqueId,
      };
    });
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;

    setRectangles((prev) => [...prev, newRect]);
    setNewRect(null);
    setIsDrawing(false);
  };

  const handleLayerClick = (_id) => {
    let f = rectangles.find((data) => data.id === _id).id;
    SetSelectedCom(f);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Backspace") {
        setRectangles((prev) => prev.filter((rect) => rect.id !== selectedCom));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCom]);

  return (
    <>
      <div ref={containerRef} className="h-screen col-span-10 bg-[#f5f5f5]">
        <Stage
          ref={stageRef}
          height={stageSize.height}
          width={stageSize.width}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <Layer>
            {rectangles.map((rect, i) => {
              return (
                <Rect
                  onClick={() => handleLayerClick(rect.id)}
                  key={i}
                  {...rect}
                  fill={rect.color}
                  stroke={
                    rect.id === selectedCom ? "rgba(0, 0, 255, 0.8)" : undefined
                  }
                  strokeWidth={1}
                  draggable={true}
                />
              );
            })}

            {newRect && (
              <Rect
                {...newRect}
                fill="rgba(0, 140, 255, 0.4)"
                stroke="rgba(0, 0, 255, 0.6)"
                strokeWidth={0.5}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </>
  );
}

export default CreateCanavaPage;
