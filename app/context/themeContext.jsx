import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({
  themeMode: "default",
  setThemeMode: () => {},
});

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState("default");
  const THEME_KEY = "APP_THEME_MODE";

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme) {
          setThemeMode(savedTheme);
        }
      } catch (e) {
        console.log("Failed to load theme", e);
      }
    };
    loadTheme();
  }, []);

  const updateThemeMode = async (mode) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
      setThemeMode(mode);
    } catch (e) {
      console.log("Failed to save theme", e);
    }
  };

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode: updateThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
