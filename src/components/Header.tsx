import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { useAuth } from "hooks/useAuth";
import { useTheme } from "hooks/useTheme";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";

const themes = [
  "amethyst-haze",
  "claude",
  "notebook",
  "bold-tech",
  "elegant-luxury",
  "t3-chat",
];

const Header = () => {
  const { theme, isDark, handleThemeChange, toggleDark } = useTheme();
  const { isLoading, isAuthenticated, user, login, logout, signup } = useAuth();

  return (
    <div className="flex flex-row justify-between items-center gap-4 p-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Select onValueChange={handleThemeChange} value={theme}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            {themes.map((theme) => (
              <SelectItem key={theme} value={theme} className="capitalize">
                {theme}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          onClick={toggleDark}
          className="px-3 py-1 border rounded text-sm"
        >
          {isDark ? "Light" : "Dark"}
        </button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild className="font-sans">
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={isAuthenticated ? user?.picture : ""}
              alt="profile"
            />
            <AvatarFallback>
              {isAuthenticated ? (
                user?.email?.[0]?.toUpperCase()
              ) : isLoading ? (
                <Skeleton className="rounded-full w-12 h-12" />
              ) : (
                "U"
              )}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-52 font-sans cursor-pointer"
          align="end"
        >
          {isAuthenticated ? (
            <>
              <DropdownMenuItem className="flex flex-row items-start gap-2 px-3 py-2">
                <Avatar>
                  <AvatarImage
                    src={isAuthenticated ? user?.picture : ""}
                    alt="profile"
                  />
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-medium text-sm break-words">
                    {user?.name}
                  </p>
                  <p className="text-muted-foreground text-xs break-words">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                Logout
              </DropdownMenuItem>
            </>
          ) : (
            <div className="font-sans">
              <DropdownMenuItem className="cursor-pointer" onClick={login}>
                Login
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={signup}>
                Signup
              </DropdownMenuItem>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
