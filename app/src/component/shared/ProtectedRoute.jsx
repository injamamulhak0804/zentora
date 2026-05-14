import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/v1/verify`, {
          credentials: "include",
        });

        if (!res.ok) {
          setIsAuth(false);
          return;
        }

        const data = await res.json();
        setIsAuth(data.success);
      } catch (error) {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };
    console.log("CHECKING AUTH...");
    verifyUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuth ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
