import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./component/ui/Sidebar";
import CreateCanavaPage from "./pages/createCanava/CreateCanavaPage";
import RightSideBar from "./component/ui/RightSideBar";
import SettingsPage from "./pages/settings/SettingsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import MobileWarningPopup from "./component/ui/MobileWarningPopup";
import Auth from "./component/shared/Auth";
import ProtectedRoute from "./component/shared/ProtectedRoute";
import { saveCanvasData } from "./helper";

function App() {
  const [active, setActive] = useState("canava");
  const [color, setColor] = useState("#FFC0CB");
  const [selectedCom, SetSelectedCom] = useState(null);
  const stageRef = useRef(null);

  const [rectangles, setRectangles] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedId, selectShape] = useState(null);

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  useEffect(() => {
    const handleBackSpace = (e) => {
      if (e.key !== "Backspace") return;
      if (!selectedCom) return;

      const tag = e.target?.tagName;
      const isTyping =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        e.target?.isContentEditable;
      if (isTyping) return;

      e.preventDefault();
      setRectangles((prev) => prev.filter((item) => item.id !== selectedCom));
      setImages((prev) => prev.filter((item) => item.id !== selectedCom));
      SetSelectedCom(null);
      selectShape(null);
    };

    window.addEventListener("keydown", handleBackSpace);
    return () => {
      window.removeEventListener("keydown", handleBackSpace);
    };
  }, [selectedCom]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        saveCanvasData({ reactangle: rectangles, images, color });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rectangles, images, color]);

  return (
    <>
      <BrowserRouter>
        <MobileWarningPopup />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div
                  className={`grid h-screen w-full ${active === "canava" ? "grid-cols-[72px_minmax(0,1fr)_200px] md:grid-cols-[72px_minmax(0,1fr)_320px]" : "grid-cols-[72px_minmax(0,1fr)_0px]"} overflow-hidden`}
                >
                  <Sidebar active={active} setActive={setActive} />

                  {active === "canava" && (
                    <CreateCanavaPage
                      color={color}
                      rectangles={rectangles}
                      setRectangles={setRectangles}
                      selectedCom={selectedCom}
                      SetSelectedCom={SetSelectedCom}
                      checkDeselect={checkDeselect}
                      selectShape={selectShape}
                      selectedId={selectedId}
                      stageRef={stageRef}
                      setImages={setImages}
                      images={images}
                    />
                  )}

                  {active === "settings" && <SettingsPage />}
                  {active === "profile" && <ProfilePage />}

                  <RightSideBar
                    color={color}
                    setRectangles={setRectangles}
                    rectangles={rectangles}
                    images={images}
                    setImages={setImages}
                    setColor={setColor}
                    selectedCom={selectedCom}
                    stageRef={stageRef}
                  />
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
{
  /* { id: "canava", icon: "C", label: "Create Canva", top: true },
  { id: "data", icon: icons.database, label: "Data", top: true },
  { id: "users", icon: icons.user, label: "Users", top: true },
  { id: "schedule", icon: icons.calendar, label: "Schedule", top: true },
  { id: "actions", icon: icons.bolt, label: "Actions", top: true },
  { id: "alerts", icon: icons.bell, label: "Alerts", top: true }, */
}
export default App;
