import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { CONFIG } from "config/config";
import { useAuth } from "hooks/useAuth";
import { useTheme } from "hooks/useTheme";
import { PlusIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddSnippet } from "store/app/appSlice";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SidebarTrigger } from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";

import type { RootState } from "store/index";

const Header = () => {
  const { theme, handleThemeChange, toggleDark } = useTheme();
  const { isLoading, isAuthenticated, user, login, logout, signup } = useAuth();
  const dispatch = useDispatch();
  const addModalState = useSelector(
    (state: RootState) => state.app.addSnippetOpen,
  );

  return (
    <div className="flex flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2 w-1/2">
        <SidebarTrigger aria-label="Toggle sidebar" />
        <Input name="search" placeholder="Search..." />
        <label htmlFor="theme-select" className="sr-only">
          Select theme
        </label>
      </div>

      <div className="flex flex-row flex-wrap justify-end items-center gap-6">
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
        <Button
          variant="secondary"
          className="bg-primary hover:bg-primary-400 text-primary-foreground cursor-pointer"
          onClick={() => dispatch(toggleAddSnippet(!addModalState))}
        >
          <PlusIcon /> Add Snippet
        </Button>
        <button
          className="theme-toggle"
          id="theme-toggle"
          title="Toggles light & dark"
          aria-label="auto"
          aria-live="polite"
          onClick={toggleDark}
        >
          <svg
            className="sun-and-moon"
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <mask className="moon" id="moon-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <circle cx="24" cy="10" r="6" fill="black" />
            </mask>
            <circle
              className="sun"
              cx="12"
              cy="12"
              r="6"
              mask="url(#moon-mask)"
              fill="currentColor"
            />
            <g className="sun-beams" stroke="currentColor">
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </g>
          </svg>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="font-sans">
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={isAuthenticated ? user?.picture : ""}
                alt="profile"
                referrerPolicy="no-referrer"
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
                    <p className="font-bold text-sm break-words">
                      {user?.name}
                    </p>
                    <p className="overflow-ellipsis text-muted-foreground text-xs break-all">
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
    </div>
  );
};

export default Header;
