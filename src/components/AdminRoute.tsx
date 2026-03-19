import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AdminRouteProps {
  children: ReactNode;
}

const adminEmails = [
  "skanda0402@gmail.com",
  "cadithya110@gmail.com",
  "bhuvijkottari@gmail.com",
];

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-100">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/recruiter" replace />;
  }

  if (!adminEmails.includes(user.email || "")) {
    return <Navigate to="/recruiter" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
