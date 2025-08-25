import { Check, Monitor, Moon, Sun } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/ThemeContext";

const ThemeSwitcher = () => {
  const { mode, handleModeChange } = useTheme();

  type ThemeMode = "light" | "dark" | "system";

  const options: {
    value: ThemeMode;
    label: string;
    icon: React.ElementType;
  }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <button
          className="flex items-center hover:bg-muted p-2 rounded-md transition"
          aria-label="mode selector"
        >
          {(() => {
            const Icon = options.find((opt) => opt.value === mode)?.icon;
            return Icon ? <Icon className="w-5 h-5" /> : null;
          })()}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">
        {options.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            asChild
            key={value}
            onSelect={() => {
              handleModeChange(value);
            }}
            className="flex justify-between items-center cursor-pointer"
          >
            <div className="flex flex-row items-start">
              {label}
              {mode === value ? (
                <Check className="w-4 h-4 text-primary" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
