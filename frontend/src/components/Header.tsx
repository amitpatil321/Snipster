import ColorThemeSwitcher from "./ColorThemeSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { SidebarTrigger } from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { isLoading, isAuthenticated, user, login, logout, signup } = useAuth();

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
        <ColorThemeSwitcher />
        <ThemeSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            aria-label="User menu"
            className="font-sans"
          >
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
            aria-label="User menu"
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
