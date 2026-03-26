import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

function MobileWarningPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Check if this is a mobile device
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Check if popup was already dismissed this session
      const popupDismissed = sessionStorage.getItem("mobilePopupDismissed");
      if (!popupDismissed) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleClose = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("mobilePopupDismissed", "true");
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`w-11/12 max-w-sm rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ${
          isFading ? "scale-95" : "scale-100"
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close popup"
        >
          <IoClose size={24} />
        </button>

        {/* Content */}
        <div className="pr-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Better Experience on Desktop
          </h2>
          <p className="mb-6 text-gray-600">
            Please check the website in desktop site for better experience and
            full functionality.
          </p>

          {/* Action button */}
          <button
            onClick={handleClose}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileWarningPopup;
