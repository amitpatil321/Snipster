import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { ThemeMode } from "@/types/app.types";

import { CONFIG } from "@/config/config";

interface ThemeContextProps {
  theme: string;
  mode: ThemeMode;
  isDark: boolean;
  handleThemeChange: (theme: string) => void;
  handleModeChange: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("app-theme") || "amethyst-haze",
  );

  const [mode, setMode] = useState<ThemeMode>(
    () => (localStorage.getItem("app-mode") as ThemeMode) || "system",
  );

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  const [isDark, setIsDark] = useState(
    mode === "system" ? prefersDark.matches : mode === "dark",
  );

  useEffect(() => {
    if (mode === "system") {
      setIsDark(prefersDark.matches);

      const listener = (e: MediaQueryListEvent) => {
        setIsDark(e.matches);
      };

      prefersDark.addEventListener("change", listener);
      return () => prefersDark.removeEventListener("change", listener);
    } else {
      setIsDark(mode === "dark");
    }
  }, [mode, prefersDark]);

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
  };

  const handleModeChange = (newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem("app-mode", newMode);
  };

  useEffect(() => {
    applyTheme(theme, isDark);
  }, [theme, isDark]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        isDark,
        handleThemeChange,
        handleModeChange,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
