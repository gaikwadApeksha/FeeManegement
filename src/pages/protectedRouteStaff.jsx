import { Navigate } from "react-router-dom";

const protectedRouteStaff = ({ children }) => {
  const staffUser = localStorage.getItem("staffUser");

  if (!staffUser) {
    return <Navigate to="/stafflogin" replace />;
  }

  return children;
};

export default protectedRouteStaff;
