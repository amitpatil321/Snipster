import { CONFIG } from "config/config";
import { useEffect, useState } from "react";

import type { ThemeMode } from "types/app.types";

export function useTheme(defaultTheme = "amethyst-haze") {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("app-theme") || defaultTheme,
  );

  const [mode, setMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem("app-mode") as ThemeMode) || "system";
  });

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  const isDark = mode === "system" ? prefersDark.matches : mode === "dark";

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

  const handleModeChange = (newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem("app-mode", newMode);
  };

  useEffect(() => {
    applyTheme(theme, isDark);
  }, [theme, isDark]);

  useEffect(() => {
    if (mode === "system") {
      const listener = (e: MediaQueryListEvent) => {
        applyTheme(theme, e.matches);
      };
      prefersDark.addEventListener("change", listener);
      return () => prefersDark.removeEventListener("change", listener);
    }
  }, [mode, theme, prefersDark]);

  return {
    theme,
    mode,
    isDark,
    handleThemeChange,
    handleModeChange,
  };
}
