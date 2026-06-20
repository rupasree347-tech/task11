import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

// Decode a JWT payload without any extra dependency.
function decodeToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function ProtectedRoute({ children, allowedRoles }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStatus("no-token");
      return;
    }

    const payload = decodeToken(token);
    const isExpired = !payload || (payload.exp && payload.exp * 1000 < Date.now());

    if (isExpired) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setStatus("expired");
      return;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const role = user?.role || payload.role;

      if (!allowedRoles.includes(role)) {
        setStatus("forbidden");
        return;
      }
    }

    setStatus("ok");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "checking") {
    return null;
  }

  if (status === "no-token" || status === "expired") {
    return <Navigate to="/" replace />;
  }

  if (status === "forbidden") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
