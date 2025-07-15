import { useEffect, useState } from "react";

const themes = [
  "amethyst-haze",
  "claude",
  "notebook",
  "bold-tech",
  "elegant-luxury",
  "t3-chat",
];

export function useTheme(defaultTheme = "amethyst-haze") {
  const [theme, setTheme] = useState(() => {
    // On first load, check localStorage or fallback
    return localStorage.getItem("app-theme") || defaultTheme;
  });
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("app-dark") === "true"; // Store as string "true" or "false"
  });

  const applyTheme = (themeName: string, dark: boolean) => {
    const body = document.body;
    body.classList.remove(...themes);
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
    localStorage.setItem("app-dark", String(newDark)); // Save as "true"/"false"
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
