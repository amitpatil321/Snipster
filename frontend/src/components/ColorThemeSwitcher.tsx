import { Check, Palette } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONFIG } from "@/config/config";
import { useTheme } from "@/context/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

const ColorThemeSwitcher = () => {
  const { theme, handleThemeChange } = useTheme();
  const isMobile = useIsMobile();

  return isMobile ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <button
          className="hover:bg-muted p-2 rounded-md transition"
          aria-label="Theme selector"
        >
          <Palette className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {CONFIG.THEMES.map((item) => (
          <DropdownMenuItem
            onSelect={() => {
              handleThemeChange(item);
            }}
            className="capitalize cursor-pointer"
          >
            {item}
            {item === theme && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Select onValueChange={handleThemeChange} value={theme}>
      <SelectTrigger
        id="theme-select"
        className="w-[160px]"
        aria-label="Theme selector"
      >
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>
      <SelectContent>
        {CONFIG.THEMES.map((theme) => (
          <SelectItem key={theme} value={theme} className="capitalize">
            <span className="capitalize">{theme}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ColorThemeSwitcher;
