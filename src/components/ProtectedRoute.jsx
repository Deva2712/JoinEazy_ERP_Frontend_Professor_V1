import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, checkAuth } = useAuth();

  useEffect(() => {
    if (isAuthenticated === null) {
      // Force a fresh auth check if state is unclear
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname, message: "Please log in to access this page" }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
