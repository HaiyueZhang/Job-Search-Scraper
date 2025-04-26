import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const ProtectedEV = ({ children }) => {
  const allowAccess = localStorage.getItem("allowEmailVerificationAccess");
  const navigate = useNavigate();

  useEffect(() => {
    if (allowAccess !== "true") {
      toast.error("You are not authorized to access this page.");
      setTimeout(() => {
        navigate("/signup");
      }, 3000);
    }
  }, [allowAccess, navigate]);

  if (allowAccess !== "true") {
    return <ToastContainer />;
  }

  return children;
};

export default ProtectedEV;
