import { useEffect, useMemo, useRef, useState } from "react";

const SMOOTH_ALPHA = 0.22;

/** Native color inputs only accept #rrggbb. */
function hex6ForColorInput(value, fallback) {
  if (typeof value === "string" && /^#[0-9A-Fa-f]{6}$/i.test(value.trim())) {
    return value.trim();
  }
  return fallback;
}

function RightSideBar({
  color,
  setColor,
  setRectangles,
  rectangles,
  selectedCom,
}) {
  const [textSize, setTextSize] = useState(16);
  const [editingDims, setEditingDims] = useState(false);
  const [smooth, setSmooth] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const smoothRef = useRef(smooth);

  const selectedShape = useMemo(
    () => rectangles.find((item) => item.id === selectedCom) || null,
    [rectangles, selectedCom],
  );

  useEffect(() => {
    smoothRef.current = smooth;
  }, [smooth]);

  /** Snap smoothing when the selected layer id changes (not every coordinate tick). */
  useEffect(() => {
    if (!selectedShape) return;
    const next = {
      x: Number(selectedShape.x),
      y: Number(selectedShape.y),
      w: Number(selectedShape.width),
      h: Number(selectedShape.height),
    };
    smoothRef.current = next;
    setSmooth(next);
  }, [selectedCom, selectedShape?.id]);

  /** Lerp X/Y/W/H toward the model while not typing in the inputs. */
  useEffect(() => {
    if (!selectedShape || editingDims) return;

    const targets = {
      x: Number(selectedShape.x),
      y: Number(selectedShape.y),
      w: Number(selectedShape.width),
      h: Number(selectedShape.height),
    };

    let raf;

    const tick = () => {
      const prev = smoothRef.current;
      const t = SMOOTH_ALPHA;
      const next = {
        x: prev.x + (targets.x - prev.x) * t,
        y: prev.y + (targets.y - prev.y) * t,
        w: prev.w + (targets.w - prev.w) * t,
        h: prev.h + (targets.h - prev.h) * t,
      };
      const epsilon = 0.45;
      const done =
        Math.abs(next.x - targets.x) < epsilon &&
        Math.abs(next.y - targets.y) < epsilon &&
        Math.abs(next.w - targets.w) < epsilon &&
        Math.abs(next.h - targets.h) < epsilon;

      if (done) {
        smoothRef.current = targets;
        setSmooth(targets);
        return;
      }

      smoothRef.current = next;
      setSmooth(next);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [
    selectedShape?.x,
    selectedShape?.y,
    selectedShape?.width,
    selectedShape?.height,
    editingDims,
    selectedCom,
  ]);

  const updateSelectedShape = (patch) => {
    if (!selectedCom) return;
    setRectangles((prev) =>
      prev.map((item) =>
        item.id === selectedCom ? { ...item, ...patch } : item,
      ),
    );
  };

  const handleSizeChange = (key, value) => {
    if (!selectedShape) return;
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;

    // keep shape usable
    updateSelectedShape({ [key]: Math.max(1, parsed) });
  };

  const shapeFillDisplay =
    selectedShape?.color ?? selectedShape?.fill ?? color ?? "#000000";

  const handleFillChange = (event) => {
    const next = event.target.value;
    setColor(next);
    if (selectedCom) {
      updateSelectedShape({ color: next, fill: next });
    }
  };

  /** Text / hex input: keep Konva fill and `color` in sync; update global swatch for new shapes. */
  const handleFillTextChange = (event) => {
    const next = event.target.value;
    if (!selectedShape) return;
    setColor(next);
    updateSelectedShape({ color: next, fill: next });
  };

  const addShape = (type) => {
    const id = crypto.randomUUID();

    const base = {
      id,
      x: 120,
      y: 120,
      color,
      fill: color,
      stroke: "transparent",
      strokeWidth: 0,
    };

    if (type === "circle") {
      setRectangles((prev) => [
        ...prev,
        {
          ...base,
          width: 110,
          height: 110,
          radius: 55,
          type: "circle",
        },
      ]);
      return;
    }

    if (type === "rect") {
      setRectangles((prev) => [
        ...prev,
        { ...base, width: 120, height: 90, cornerRadius: 0 },
      ]);
      return;
    }

    if (type === "square") {
      setRectangles((prev) => [...prev, { ...base, width: 100, height: 100 }]);
      return;
    }

    if (type === "pill") {
      setRectangles((prev) => [
        ...prev,
        { ...base, width: 140, height: 56, cornerRadius: 9999 },
      ]);
    }
  };

  const handlePositionChange = (key, value) => {
    if (!selectedShape) return;
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;

    updateSelectedShape({ [key]: parsed });
  };

  return (
    <aside className="h-full w-full border-l border-border bg-surface text-text-primary">
      <div className="flex h-full min-h-0 max-h-screen flex-col overflow-y-scroll pb-10">
        {/* Header */}
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Design</p>
          <p className="text-xs text-text-secondary">
            {selectedShape ? `Selected: ${selectedShape.id}` : "No selection"}
          </p>
        </div>

        {/* Scrollable controls */}
        <div className="flex-1 space-y-5 px-3 py-3">
          {/* position  */}
          <PanelSection title="Position">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs text-text-secondary">
                  X
                </label>
                <input
                  type="number"
                  value={
                    selectedShape
                      ? Math.round(
                          editingDims ? Number(selectedShape.x) : smooth.x,
                        ).toString()
                      : ""
                  }
                  onChange={(e) => handlePositionChange("x", e.target.value)}
                  onFocus={() => setEditingDims(true)}
                  onBlur={() => setEditingDims(false)}
                  disabled={!selectedShape}
                  className="h-8 w-full rounded-md border border-border bg-subtle px-2 text-sm outline-none transition-[color,background-color,border-color] duration-150 ease-out focus:border-border-focus disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-text-secondary">
                  Y
                </label>
                <input
                  type="number"
                  value={
                    selectedShape ? Number(selectedShape.y).toFixed(0) : ""
                  }
                  onChange={(e) => handlePositionChange("y", e.target.value)}
                  disabled={!selectedShape}
                  className="h-8 w-full rounded-md border border-border bg-subtle px-2 text-sm outline-none focus:border-border-focus disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {!selectedShape && (
              <p className="mt-2 text-xs text-text-tertiary">
                Select a layer to edit position
              </p>
            )}
          </PanelSection>

          <PanelSection title="Size">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs text-text-secondary">
                  W
                </label>
                <input
                  type="number"
                  min={1}
                  value={
                    selectedShape
                      ? Math.round(
                          editingDims ? Number(selectedShape.width) : smooth.w,
                        ).toString()
                      : ""
                  }
                  onChange={(e) => handleSizeChange("width", e.target.value)}
                  onFocus={() => setEditingDims(true)}
                  onBlur={() => setEditingDims(false)}
                  disabled={!selectedShape}
                  className="h-8 w-full rounded-md border border-border bg-subtle px-2 text-sm outline-none transition-[color,background-color,border-color] duration-150 ease-out focus:border-border-focus disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-text-secondary">
                  H
                </label>
                <input
                  type="number"
                  min={1}
                  value={
                    selectedShape ? Number(selectedShape.height).toFixed(0) : ""
                  }
                  onChange={(e) => handleSizeChange("height", e.target.value)}
                  disabled={!selectedShape}
                  className="h-8 w-full rounded-md border border-border bg-subtle px-2 text-sm outline-none focus:border-border-focus disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>
            {!selectedShape && (
              <p className="my-2 text-xs text-text-tertiary">
                Select a layer to edit size
              </p>
            )}
          </PanelSection>

          <PanelSection title="Fill">
            <div className="flex items-center gap-2">
              <input
                type="color"
                title={
                  selectedShape
                    ? "Shape fill (also updates default for new shapes)"
                    : "Default fill for new shapes"
                }
                value={hex6ForColorInput(
                  selectedShape ? shapeFillDisplay : color,
                  hex6ForColorInput(color, "#FFC0CB"),
                )}
                className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent"
                onChange={handleFillChange}
              />
              <input
                type="text"
                value={selectedShape ? shapeFillDisplay : ""}
                onChange={handleFillTextChange}
                placeholder={
                  selectedShape ? "#hex or css color" : "Select a shape first"
                }
                disabled={!selectedShape}
                className="h-8 w-full rounded-md border border-border bg-subtle px-2 text-sm outline-none focus:border-border-focus disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </PanelSection>

          <PanelSection title="Stroke">
            <div className="grid grid-cols-[1fr_72px] gap-2">
              <input
                type="text"
                value={selectedShape?.stroke || "transparent"}
                onChange={(e) =>
                  updateSelectedShape({ stroke: e.target.value })
                }
                placeholder="Stroke color"
                className="h-8 rounded-md border border-border bg-subtle px-2 text-sm outline-none focus:border-border-focus"
              />
              <input
                type="number"
                min={0}
                max={20}
                value={selectedShape?.strokeWidth ?? 0}
                onChange={(e) =>
                  updateSelectedShape({ strokeWidth: Number(e.target.value) })
                }
                className="h-8 rounded-md border border-border bg-subtle px-2 text-sm outline-none focus:border-border-focus"
              />
            </div>
          </PanelSection>

          {/* <PanelSection title="Text">
            <label className="mb-1 block text-xs text-text-secondary">
              Size
            </label>
            <input
              type="range"
              min={8}
              max={96}
              value={textSize}
              onChange={(e) => setTextSize(Number(e.target.value))}
              className="w-full accent-(--color-accent)"
            />
            <div className="mt-1 flex justify-between text-xs text-text-tertiary">
              <span>8</span>
              <span>{textSize}px</span>
              <span>96</span>
            </div>
          </PanelSection> */}

          <PanelSection title="Quick Shapes">
            <div className="grid grid-cols-3 gap-2">
              <ToolButton label="Rect" onClick={() => addShape("rect")} />
              <ToolButton label="circle" onClick={() => addShape("circle")} />
              <ToolButton label="Pill" onClick={() => addShape("pill")} />
            </div>
          </PanelSection>
        </div>

        {/* Footer actions */}
        <div className="border-t border-border p-3">
          <button className="h-9 w-full rounded-md bg-accent text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover">
            Export
          </button>
        </div>
      </div>
    </aside>
  );
}

function PanelSection({ title, children }) {
  return (
    <section className="rounded-lg border border-border-subtle bg-panel">
      <div className="border-b border-border-subtle px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          {title}
        </p>
      </div>
      <div className="px-3 py-3">{children}</div>
    </section>
  );
}

function ToolButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="h-8 rounded-md border border-border bg-subtle text-xs font-medium text-text-primary transition-colors hover:bg-accent-subtle hover:text-text-accent"
    >
      {label}
    </button>
  );
}

export default RightSideBar;
