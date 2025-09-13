import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function RequireAuth() {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (!user.aadhaarVerified)
    return <Navigate to="/verify-aadhaar" state={{ from: loc }} replace />;
  return <Outlet />;
}
