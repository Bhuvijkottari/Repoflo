import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requireApproved?: boolean;
}

const ProtectedRoute = ({ children, requireApproved = false }: ProtectedRouteProps) => {
  const { user, loading, isRecruiter, isApprovedRecruiter } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-100">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/recruiter" state={{ from: location }} replace />;
  }

  if (requireApproved && !isApprovedRecruiter) {
    return <Navigate to="/recruiter" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
