export function hex6ForColorInput(value, fallback) {
  if (typeof value === "string" && /^#[0-9A-Fa-f]{6}$/i.test(value.trim())) {
    return value.trim();
  }
  return fallback;
}

export const addShape = (type, color, setRectangles) => {
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
      { ...base, width: 120, height: 90, cornerRadius: 0, type: "rect" },
    ]);
    return;
  }

  if (type === "square") {
    setRectangles((prev) => [
      ...prev,
      { ...base, width: 100, height: 100, type: "square" },
    ]);
    return;
  }

  if (type === "pill") {
    setRectangles((prev) => [
      ...prev,
      {
        ...base,
        width: 140,
        height: 56,
        cornerRadius: 9999,
        type: "pill",
      },
    ]);
    return;
  }

  if (type === "triangle") {
    setRectangles((prev) => [
      ...prev,
      {
        ...base,
        width: 130,
        height: 100,
        type: "triangle",
      },
    ]);
    return;
  }

  if (type === "arrow") {
    setRectangles((prev) => [
      ...prev,
      {
        ...base,
        width: 160,
        height: 60,
        type: "arrow",
        // Arrow shaft uses stroke; give it a default stroke width so it's visible.
        stroke: color,
        strokeWidth: 4,
      },
    ]);
    return;
  }

  if (type === "text") {
    setRectangles((prev) => [
      ...prev,
      {
        ...base,
        type: "text",
        text: "Double click to edit",
        fontSize: 24,
        fontFamily: "Arial",
        width: 220,
        height: 30,
        align: "left",
        lineHeight: 1.2,
        fill: color,
      },
    ]);
    return;
  }
};

export async function downloadPDF(stageRef, options = {}) {
  const stage = stageRef?.current;
  if (!stage) return;

  const { fileName = "canvas.pdf", pixelRatio = 2, margin = 0 } = options;

  // Lazy import to keep initial bundle smaller
  const { jsPDF } = await import("jspdf");

  const width = stage.width();
  const height = stage.height();

  const dataUrl = stage.toDataURL({
    pixelRatio,
    mimeType: "image/png",
  });

  const orientation = width >= height ? "landscape" : "portrait";
  const pdf = new jsPDF({
    orientation,
    unit: "px",
    format: [width + margin * 2, height + margin * 2],
    compress: true,
  });

  pdf.addImage(dataUrl, "PNG", margin, margin, width, height);
  pdf.save(fileName);
}
