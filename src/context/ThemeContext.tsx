import React, { createContext, useState, useEffect } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext({
  darkMode: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme(); // Get system default theme
  const [darkMode, setDarkMode] = useState(systemTheme === 'dark');

  useEffect(() => {
    loadTheme();
  }, []);

  // Load theme from AsyncStorage
  const loadTheme = async () => {
    const theme = await AsyncStorage.getItem('theme');
    if (theme) {
      setDarkMode(theme === 'dark');
    }
  };

  // Toggle Theme & Save Preference
  const toggleTheme = async () => {
    const newTheme = !darkMode ? 'dark' : 'light';
    setDarkMode(!darkMode);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
