import { CONFIG } from "config/config";
import { useEffect, useState } from "react";

export function useTheme(defaultTheme = "amethyst-haze") {
  const [theme, setTheme] = useState(() => {
    // On first load, check localStorage or fallback
    return localStorage.getItem("app-theme") || defaultTheme;
  });
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("app-dark") === "true";
  });

  const applyTheme = (themeName: string, dark: boolean) => {
    const body = document.body;
    body.classList.remove(...CONFIG.THEMES);
    body.classList.add(themeName);
    if (dark) {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  };

  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
    localStorage.setItem("app-theme", selectedTheme);
    applyTheme(selectedTheme, isDark);
  };

  const toggleDark = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("app-dark", String(newDark));
    applyTheme(theme, newDark);
  };

  useEffect(() => {
    applyTheme(theme, isDark);
  }, [theme, isDark]);

  return {
    theme,
    isDark,
    handleThemeChange,
    toggleDark,
  };
}
