import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const SessionTimer = ({
  timeout = 1000 * 60 * 15,
  promptTimeout = 1000 * 30,
}) => {
  const [idle, setIdle] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let timeoutId = null;
  let promptTimeoutId = null;

  const resetTimer = useCallback(() => {
    clearTimeout(timeoutId);
    clearTimeout(promptTimeoutId);
    setIdle(false);
    timeoutId = setTimeout(() => setIdle(true), timeout);
  }, [timeout]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click"];
    const handleActivity = () => {
      if (!idle) {
        resetTimer();
      }
    };

    // Attach event listeners if the user is not idle
    if (!idle) {
      events.forEach((event) => window.addEventListener(event, handleActivity));
    }

    return () => {
      // Cleanup listeners when the component unmounts or when idle state changes
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
    };
  }, [resetTimer, idle]);

  const handleStayActive = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const handleLogout = useCallback(() => {
    clearTimeout(timeoutId);
    clearTimeout(promptTimeoutId);
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  useEffect(() => {
    if (idle) {
      // Start the prompt timeout only when idle is true
      promptTimeoutId = setTimeout(() => {
        handleLogout(); // Automatically log out when the prompt timer expires
      }, promptTimeout);
    }
    return () => clearTimeout(promptTimeoutId);
  }, [idle, promptTimeout, handleLogout]);

  return (
    <>
      {idle && (
        <div className="idle-prompt">
          <h2>Are you still there?</h2>
          <p>
            Your session will expire in {promptTimeout / 1000} seconds. Do you
            want to stay logged in?
          </p>
          <button onClick={handleStayActive}>Yes, keep me logged in</button>
          <button onClick={handleLogout}>No, log me out</button>
        </div>
      )}
    </>
  );
};

export default SessionTimer;
