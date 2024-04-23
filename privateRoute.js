import React, { useEffect } from 'react';

const IdleTimer = ({ onIdle, timeout = 1000 * 60 * 15 }) => {
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    let timeoutId = setTimeout(onIdle, timeout);
    
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(onIdle, timeout);
    };
    
    events.forEach(event => window.addEventListener(event, resetTimer));
    
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [onIdle, timeout]);

  return null;
};

export default IdleTimer;
