import { useEffect } from 'react';

const useIdleTimer = (onIdle, timeout = 1000 * 60 * 15) => {
  useEffect(() => {
    let timeoutId = setTimeout(onIdle, timeout);

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(onIdle, timeout);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('click', resetTimer);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [onIdle, timeout]);
};

export default useIdleTimer;
