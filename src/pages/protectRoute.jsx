import { Navigate } from "react-router-dom";

const protectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  const adminUser = localStorage.getItem("adminUser");

  if (!user && !adminUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default protectedRoute;