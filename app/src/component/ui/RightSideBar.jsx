import { useMemo } from "react";
import { addShape, downloadPDF, hex6ForColorInput } from "../../helper";

function RightSideBar({
  color,
  setColor,
  setRectangles,
  rectangles,
  images,
  setImages,
  selectedCom,
  stageRef,
}) {
  const selectedRect = useMemo(
    () => rectangles.find((item) => item.id === selectedCom) || null,
    [rectangles, selectedCom],
  );

  const selectedImage = useMemo(
    () => images.find((item) => item.id === selectedCom) || null,
    [images, selectedCom],
  );

  const selectedShape = selectedRect || selectedImage || null;

  const updateSelectedShape = (patch) => {
    if (!selectedCom) return;

    if (selectedRect) {
      setRectangles((prev) =>
        prev.map((item) =>
          item.id === selectedCom ? { ...item, ...patch } : item,
        ),
      );
      return;
    }

    if (selectedImage) {
      setImages((prev) =>
        prev.map((item) =>
          item.id === selectedCom ? { ...item, ...patch } : item,
        ),
      );
    }
  };

  const handleSizeChange = (key, value) => {
    if (!selectedShape) return;
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;

    // keep shape usable
    updateSelectedShape({ [key]: Math.max(1, parsed) });
  };

  const shapeFillDisplay =
    selectedRect?.color ?? selectedRect?.fill ?? color ?? "#000000";

  const handleFillChange = (event) => {
    if (!selectedRect) return;
    const next = event.target.value;
    setColor(next);
    if (selectedCom) {
      const patch = { color: next, fill: next };

      // For arrows, the visible shaft uses stroke; keep it in sync only when the user
      // hasn't explicitly changed stroke away from the previous fill color.
      if (selectedRect.type === "arrow") {
        const shouldSyncStroke =
          !selectedRect.stroke ||
          selectedRect.stroke === "transparent" ||
          selectedRect.stroke === selectedRect.fill ||
          selectedRect.stroke === selectedRect.color;

        if (shouldSyncStroke) patch.stroke = next;
      }

      updateSelectedShape(patch);
    }
  };

  /** Text / hex input: keep Konva fill and `color` in sync; update global swatch for new shapes. */
  const handleFillTextChange = (event) => {
    if (!selectedRect) return;
    const next = event.target.value;
    setColor(next);

    const patch = { color: next, fill: next };
    if (selectedRect.type === "arrow") {
      const shouldSyncStroke =
        !selectedRect.stroke ||
        selectedRect.stroke === "transparent" ||
        selectedRect.stroke === selectedRect.fill ||
        selectedRect.stroke === selectedRect.color;
      if (shouldSyncStroke) patch.stroke = next;
    }

    updateSelectedShape(patch);
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
                      ? Math.round(Number(selectedShape.x)).toString()
                      : ""
                  }
                  onChange={(e) => handlePositionChange("x", e.target.value)}
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
                      ? Math.round(Number(selectedShape.width)).toString()
                      : ""
                  }
                  onChange={(e) => handleSizeChange("width", e.target.value)}
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
                  selectedRect
                    ? "Shape fill (also updates default for new shapes)"
                    : "Default fill for new shapes"
                }
                value={hex6ForColorInput(
                  selectedRect ? shapeFillDisplay : color,
                  hex6ForColorInput(color, "#FFC0CB"),
                )}
                disabled={!selectedRect}
                className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent disabled:cursor-not-allowed disabled:opacity-60"
                onChange={handleFillChange}
              />
              <input
                type="text"
                value={selectedRect ? shapeFillDisplay : ""}
                onChange={handleFillTextChange}
                placeholder={
                  selectedRect ? "#hex or css color" : "Select a shape first"
                }
                disabled={!selectedRect}
                className="h-8 w-full rounded-md border border-border bg-subtle px-2 text-sm outline-none focus:border-border-focus disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </PanelSection>

          <PanelSection title="Stroke">
            <div className="grid grid-cols-[1fr_72px] gap-2">
              <input
                type="text"
                value={selectedRect?.stroke || ""}
                onChange={(e) =>
                  selectedRect &&
                  updateSelectedShape({ stroke: e.target.value })
                }
                placeholder="Stroke color"
                disabled={!selectedRect}
                className="h-8 rounded-md border border-border bg-subtle px-2 text-sm outline-none focus:border-border-focus disabled:cursor-not-allowed disabled:opacity-60"
              />
              <input
                type="number"
                min={0}
                max={20}
                value={selectedRect?.strokeWidth || 0}
                onChange={(e) =>
                  selectedRect &&
                  updateSelectedShape({ strokeWidth: Number(e.target.value) })
                }
                disabled={!selectedRect}
                className="h-8 rounded-md border border-border bg-subtle px-2 text-sm outline-none focus:border-border-focus disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </PanelSection>

          <PanelSection title="Text">
            <label className="mb-1 block text-xs text-text-secondary">Text</label>
            <input
              type="text"
              value={selectedRect?.text || ""}
              onChange={(e) =>
                selectedRect && updateSelectedShape({ text: e.target.value })
              }
              disabled={!selectedRect || selectedRect.type !== "text"}
              placeholder={
                selectedRect && selectedRect.type === "text"
                  ? "Edit text"
                  : "Select text shape"
              }
              className="h-8 w-full rounded-md border border-border bg-subtle px-2 text-sm outline-none focus:border-border-focus disabled:cursor-not-allowed disabled:opacity-60"
            />
          </PanelSection>

          <PanelSection title="Quick Shapes">
            <div className="grid grid-cols-3 gap-2">
              <ToolButton
                label="Rect"
                onClick={() => addShape("rect", color, setRectangles)}
              />
              <ToolButton
                label="circle"
                onClick={() => addShape("circle", color, setRectangles)}
              />
              <ToolButton
                label="Pill"
                onClick={() => addShape("pill", color, setRectangles)}
              />
              <ToolButton
                label="Triangle"
                onClick={() => addShape("triangle", color, setRectangles)}
              />
              <ToolButton
                label="Arrow"
                onClick={() => addShape("arrow", color, setRectangles)}
              />
            </div>
          </PanelSection>
        </div>

        {/* Footer actions */}
        <div className="border-t border-border p-3">
          <button
            onClick={() => downloadPDF(stageRef)}
            className="h-9 w-full rounded-md bg-accent text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
          >
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
