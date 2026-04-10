import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = (localStorage.getItem("role") || "").toLowerCase();
  const requiredRole = (role || "").toLowerCase();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && requiredRole !== userRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
