import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "components/ui/sidebar";
import { ROUTES } from "config/routes.config";
import { cn } from "lib/utils";
import { Heart, List, Trash } from "lucide-react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
import { setCurrentPage } from "store/app/appSlice";

import Loading from "./Loading";
import { Badge } from "./ui/badge";

import type { RootState } from "store/index";

interface PropTypes {
  counts: { all: number | null; favorite: number | null; trash: number | null };
  loading: boolean;
}

const AppSidebar = ({ counts, loading }: PropTypes) => {
  const { all, favorite, trash } = counts || {};
  const { open } = useSidebar();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPage = useSelector((state: RootState) => state.app.currentPage);

  const items = useMemo(
    () => [
      {
        label: "All Snippets",
        name: "all",
        icon: List,
        path: ROUTES.ALL,
        count: all || "-",
      },
      {
        label: "Favorite",
        name: "favorite",
        icon: Heart,
        path: ROUTES.FAVORITE,
        count: favorite || "-",
      },
      {
        label: "Trash",
        name: "trash",
        icon: Trash,
        path: ROUTES.TRASH,
        count: trash || "-",
      },
    ],
    [all, favorite, trash],
  );

  useEffect(() => {
    const item = items.find(
      (each) => each.path === location.pathname.split("/")?.[1],
    );
    if (item) {
      dispatch(setCurrentPage({ label: item.label, path: item.path }));
    }
  }, [location.pathname, dispatch, items]);

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="items-center mt-4 mb-4 text-2xl">
        {open && <Link to={ROUTES.HOME}>Snipster</Link>}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((each) => {
              return (
                <Link
                  key={each.label}
                  to={each.path}
                  onClick={() =>
                    dispatch(
                      setCurrentPage({ label: each.label, path: each.path }),
                    )
                  }
                >
                  <SidebarMenuButton
                    tooltip={each.label}
                    className={cn(
                      "flex justify-between items-center h-11 transition-colors duration-700 cursor-pointer",
                      currentPage?.path === each.path
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <div className="flex flex-row justify-center items-center gap-2">
                      <each.icon />
                      {each.label}
                    </div>
                    <Badge
                      variant="secondary"
                      className="px-1 rounded-full min-w-5 h-5 font-bold tabular-nums"
                    >
                      {loading ? <Loading size="small" /> : each.count}
                    </Badge>
                  </SidebarMenuButton>
                </Link>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
