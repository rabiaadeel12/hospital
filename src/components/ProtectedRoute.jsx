import React from "react";// src/components/layout/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Requires login (any role)
export function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

// Requires admin role
export function AdminRoute({ children }) {
  const { currentUser, userRole } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (userRole !== "admin") return <Navigate to="/" replace />;
  return children;
}

// Requires patient role — admins are also allowed in
export function PatientRoute({ children }) {
  const { currentUser, userRole } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  // Admin can access patient portal too, patient cannot access admin
  if (userRole !== "patient" && userRole !== "admin") return <Navigate to="/" replace />;
  return children;
}