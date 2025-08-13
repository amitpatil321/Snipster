import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONFIG } from "@/config/config";
import { useTheme } from "@/hooks/useTheme";

const ColorThemeSwitcher = () => {
  const { theme, handleThemeChange } = useTheme();

  return (
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
