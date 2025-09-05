import { LogIn, LogOut, Search, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

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
import { CONFIG } from "@/config/config";
import { ROUTES } from "@/config/routes.config";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [searchText, setSearchText] = useState<string>("");
  const { isLoading, isAuthenticated, user, login, logout, signup } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchText && location.pathname.startsWith(`/${ROUTES.ALL}`)) {
        navigate(
          `/${ROUTES.ALL}?${CONFIG.SEARCH_PARAM}=${encodeURIComponent(searchText)}`,
        );
      } else {
        if (location.pathname.startsWith(`/${ROUTES.ALL}`)) {
          searchParams.delete(CONFIG.SEARCH_PARAM);
          navigate(`/${ROUTES.ALL}?${searchParams.toString()}`);
        }
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchText, navigate, searchParams]);

  return (
    <div className="flex flex-row md:flex-row justify-between items-center md:gap-4 p-2 md:p-2">
      <div className="flex flex-2/3 items-center gap-2 w-full md:w-1/2">
        <SidebarTrigger aria-label="Toggle sidebar" />
        <div className="relative w-full h-10">
          <Search className="top-[18px] left-2 z-10 absolute opacity-50 text-muted-foreground -translate-y-1/2 transform" />
          <Input
            type="text"
            placeholder="Search..."
            className="shadow-sm py-2 pr-3 pl-10 border border-gray-300 focus:border-transparent rounded focus:outline-none focus:ring-[#6E23DD] focus:ring-2 w-full text-md"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          {searchText && (
            <X
              onClick={() => setSearchText("")}
              className="top-[18px] right-2 z-10 absolute text-muted-foreground -translate-y-1/2 cursor-pointer transform"
            />
          )}
        </div>
      </div>

      <div className="flex flex-row flex-wrap flex-4/12 md:flex-2/5 justify-end items-center gap-1 md:gap-2 w-full md:w-auto md:gap4">
        {/* <div className="flex flex-row items-center md:gap-2"> */}
        <ColorThemeSwitcher />
        <ThemeSwitcher />
        {/* </div> */}
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
                <DropdownMenuItem
                  aria-label="User profile"
                  className="flex flex-row items-start gap-2 px-3 py-2"
                >
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
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </>
            ) : (
              <div className="font-sans">
                <DropdownMenuItem className="cursor-pointer" onClick={login}>
                  <LogIn /> Login
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={signup}>
                  <UserPlus /> Signup
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
