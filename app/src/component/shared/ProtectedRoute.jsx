import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

let verifyRequestPromise = null;

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    let isMounted = true;

    const verifyUser = async () => {
      try {
        if (!verifyRequestPromise) {
          verifyRequestPromise = fetch(`${backendUrl}/api/v1/verify`, {
            credentials: "include",
          })
            .then(async (res) => {
              if (!res.ok) return false;
              const data = await res.json();
              return Boolean(data.success);
            })
            .catch(() => false)
            .finally(() => {
              verifyRequestPromise = null;
            });
        }

        const authResult = await verifyRequestPromise;
        if (!isMounted) return;
        setIsAuth(authResult);
      } catch {
        if (!isMounted) return;
        setIsAuth(false);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    verifyUser();

    return () => {
      isMounted = false;
    };
  }, [backendUrl]);

  if (loading) return <div>Loading...</div>;

  return isAuth ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
