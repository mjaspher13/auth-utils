import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadTheme } from './loadTheme';

const ThemeSwitcher = () => {
  const location = useLocation();

  useEffect(() => {
    let theme = 'light'; // default theme
    if (location.pathname.includes('dark')) {
      theme = 'dark';
    } else if (location.pathname.includes('another')) {
      theme = 'another';
    }
    loadTheme(theme);
  }, [location]);

  return null;
};

export default ThemeSwitcher;
