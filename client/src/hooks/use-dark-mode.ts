import { useState, useEffect } from "react";

type Theme = "dark" | "light";

export function useDarkMode() {
  // Get initial theme from localStorage or OS preference
  const getInitialTheme = (): Theme => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedPrefs = window.localStorage.getItem("theme");
      if (typeof storedPrefs === "string") {
        return storedPrefs as Theme;
      }

      const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
      if (userMedia.matches) {
        return "dark";
      }
    }

    return "light"; // default theme
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Apply theme to document
  const setMode = (mode: Theme) => {
    window.localStorage.setItem("theme", mode);
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setTheme(mode);
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setMode(theme === "light" ? "dark" : "light");
  };

  // Initialize theme on mount
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setMode(initialTheme);
  }, []);

  return { theme, toggleTheme, setTheme };
}
