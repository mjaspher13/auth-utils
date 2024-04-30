import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionStorageListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = (event) => {
      console.log("Session Storage Change Detected:", event.detail);
      if (
        event.detail.type === "clear" ||
        (event.detail.type === "delete" && event.detail.key === "authToken")
      ) {
        navigate("/login"); // Redirect to login if the authToken is cleared or deleted
      }
    };

    document.addEventListener("sessionStorageChanged", handleStorageChange);

    return () => {
      document.removeEventListener(
        "sessionStorageChanged",
        handleStorageChange
      );
    };
  }, [navigate]);

  return null;
};

export default SessionStorageListener;
