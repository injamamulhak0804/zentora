import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Portal = ({
  children,
  isOpen = true,
  isOverlay = true,
  overlayColor = "rgba(0,0,0,0.5)",
  CloseBtn = false,
  onClose = () => {},
}) => {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState(null);

//   const container =

//   useEffect(() => {
//     const div = document.querySelector("#portal-root");
//     document.body.appendChild(div);
//     setContainer(div);
//     setMounted(true);

//     return () => {
//       document.body.removeChild(div);
//     };
//   }, []);

  if (!mounted || !isOpen || !container) return null;
  logger("Rendering Portal with container:", container);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: isOverlay ? overlayColor : "transparent",
      }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {CloseBtn && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            ✕
          </button>
        )}
        {children}
      </div>
    </div>,
    div
  );
};

export default Portal;