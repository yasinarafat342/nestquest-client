import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/common/Loader.jsx";

export default function RoleRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return children;
}
