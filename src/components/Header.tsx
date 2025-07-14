import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { useEffect, useState } from "react";

import { SidebarTrigger } from "./ui/sidebar";

const themes = [
  "amethyst-haze",
  "claude",
  "notebook",
  "bold-tech",
  "elegant-luxury",
];

const Header = () => {
  const [theme, setTheme] = useState("");
  const [isDark, setIsDark] = useState(false);

  const applyTheme = (themeName: string, dark: boolean) => {
    const body = document.body;
    body.classList.remove(...themes);
    body.classList.add(themeName);
    if (dark) {
      body.classList.add("dark");
    }
  };

  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
    applyTheme(selectedTheme, isDark);
  };

  const handleDarkToggle = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    applyTheme(theme, newDark);
    if (isDark) document.body.classList.remove("dark");
  };

  useEffect(() => {
    document.body.classList.add("amethyst-haze");
  }, []);

  return (
    <div className="flex flex-row items-center gap-4">
      <SidebarTrigger />
      <Select onValueChange={handleThemeChange} value={theme}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select color theme" />
        </SelectTrigger>
        <SelectContent>
          {themes.map((theme) => {
            return (
              <SelectItem key={theme} value={theme} className="font-sans">
                <span className="capitalize">{theme}</span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <button onClick={handleDarkToggle} className="p-2 border rounded">
        {isDark ? "Light" : "Dark"}
      </button>
    </div>
  );
};

export default Header;
