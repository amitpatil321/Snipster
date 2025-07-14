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
  const [theme, setTheme] = useState(defaultTheme);
  const [isDark, setIsDark] = useState(false);

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
    applyTheme(selectedTheme, isDark);
  };

  const toggleDark = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    applyTheme(theme, newDark);
  };

  useEffect(() => {
    applyTheme(defaultTheme, isDark);
  }, [defaultTheme, isDark]);

  return {
    theme,
    isDark,
    handleThemeChange,
    toggleDark,
  };
}
