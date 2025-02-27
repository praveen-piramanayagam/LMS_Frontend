import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = sessionStorage.getItem("user"); // Check if user is logged in

  return user ? children : <Navigate to="/" replace />; // Redirect to login if not logged in
};

export default ProtectedRoute;
