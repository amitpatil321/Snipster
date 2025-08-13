import { Laptop, MoonIcon, SunIcon } from "lucide-react";

import type { ThemeMode } from "@/types/app.types";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTheme } from "@/hooks/useTheme";

const ThemeSwitcher = () => {
  const { mode, handleModeChange } = useTheme();

  return (
    <ToggleGroup
      type="single"
      size="sm"
      value={mode}
      onValueChange={(val: ThemeMode) => val && handleModeChange(val)}
    >
      <ToggleGroupItem
        value="light"
        aria-label="Light mode"
        className="cursor-pointer"
      >
        <SunIcon />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="system"
        aria-label="System mode"
        className="cursor-pointer"
      >
        <Laptop />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="dark"
        aria-label="Dark mode"
        className="cursor-pointer"
      >
        <MoonIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ThemeSwitcher;
