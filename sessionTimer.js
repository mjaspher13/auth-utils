import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const SessionTimer = ({ timeout = 1000 * 60 * 15 }) => {
  const [idle, setIdle] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let timeoutId;

  const resetTimer = useCallback(() => {
    clearTimeout(timeoutId);
    setIdle(false);
    timeoutId = setTimeout(() => setIdle(true), timeout);
  }, [timeout]);

  useEffect(() => {
    timeoutId = setTimeout(() => setIdle(true), timeout);
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [resetTimer]);

  const handleStayActive = useCallback(() => {
    resetTimer();  // This will reset the idle timer
  }, [resetTimer]);

  const handleLogout = useCallback(() => {
    setIdle(false);
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  return (
    <>
      {idle && (
        <div className="idle-prompt">
          <h2>Are you still there?</h2>
          <p>Your session will expire soon. Do you want to stay logged in?</p>
          <button onClick={handleStayActive}>Yes, keep me logged in</button>
          <button onClick={handleLogout}>No, log me out</button>
        </div>
      )}
    </>
  );
};

export default SessionTimer;
