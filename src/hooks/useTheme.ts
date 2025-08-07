import { CONFIG } from "config/config";
import { useEffect, useState } from "react";

export function useTheme(defaultTheme = "amethyst-haze") {
  const [theme, setTheme] = useState(() => {
    // On first load, check localStorage or fallback
    return localStorage.getItem("app-theme") || defaultTheme;
  });
  // const [isDark, setIsDark] = useState(() => {
  //   return localStorage.getItem("app-dark") === "true";
  // });
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("app-dark");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const applyTheme = (themeName: string, dark: boolean) => {
    const html = document.documentElement;
    const body = document.body;

    body.classList.remove(...CONFIG.THEMES);
    body.classList.add(themeName);

    body.classList.toggle("dark", dark);

    html.setAttribute("data-theme", dark ? "dark" : "light");

    const toggleButton = document.querySelector("#theme-toggle");
    if (toggleButton) {
      toggleButton.setAttribute("aria-label", dark ? "dark" : "light");
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
