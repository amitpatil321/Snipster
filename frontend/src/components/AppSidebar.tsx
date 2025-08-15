import { Folder as FolderIcon, Heart, List, Plus, Trash } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router";

import Loading from "./Loading";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

import type { RootState } from "@/store/index";
import type { Folder } from "@/types/folder.types";
import type { SnippetCountType } from "@/types/snippet.types";

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
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CONFIG } from "@/config/config";
import { ROUTES } from "@/config/routes.config";
import { cn } from "@/lib/utils";
import { setCurrentPage } from "@/store/app/appSlice";

interface PropTypes {
  counts: SnippetCountType;
  loading: boolean;
  folders: Folder[];
  foldersLoading: boolean;
}

const AppSidebar = ({
  counts,
  loading,
  folders,
  foldersLoading,
}: PropTypes) => {
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
        path: `/${ROUTES.ALL}`,
        count: all || 0,
      },
      {
        label: "Favorite",
        name: "favorite",
        icon: Heart,
        path: `/${ROUTES.FAVORITE}`,
        count: favorite || 0,
      },
      {
        label: "Trash",
        name: "trash",
        icon: Trash,
        path: `/${ROUTES.TRASH}`,
        count: trash || 0,
      },
    ],
    [all, favorite, trash],
  );

  useEffect(() => {
    const currentPath = location.pathname;
    const matchedItem = items.find((each) => each.path === currentPath);
    if (matchedItem) {
      dispatch(
        setCurrentPage({
          label: matchedItem.label,
          path: matchedItem.path,
          type: matchedItem.path.split("/")?.[1],
        }),
      );
    }
  }, [location.pathname, items, dispatch]);

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="items-center mt-4 mb-4 text-2xl">
        {open && <Link to={ROUTES.HOME}>Snipster</Link>}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((each) => (
              <SidebarItem
                key={each.label}
                label={each.label}
                path={each.path}
                icon={each.icon}
                count={each.count}
                loading={loading}
                isActive={currentPage?.path === each.path}
                onClick={() =>
                  dispatch(
                    setCurrentPage({ label: each.label, path: each.path }),
                  )
                }
              />
            ))}
          </SidebarMenu>
          <br />
          <SidebarGroupLabel className="flex flex-row justify-between w-full">
            <div>Folders {folders && "(" + folders.length + ")"}</div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-6 cursor-pointer"
                >
                  <Plus />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add folder</TooltipContent>
            </Tooltip>
          </SidebarGroupLabel>
          <SidebarMenu>
            {folders?.map((each) => (
              <SidebarItem
                key={each._id}
                label={each.name}
                path={`${CONFIG.PATHS.FOLDER}/${each._id}`}
                icon={FolderIcon}
                count={each.snippetCount}
                loading={foldersLoading}
                isActive={currentPage?.label === each.name}
                onClick={() =>
                  dispatch(setCurrentPage({ label: each.name, path: each._id }))
                }
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

interface SidebarItemProps {
  label: string;
  path: string;
  icon: React.ElementType;
  count?: number;
  loading?: boolean;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem = ({
  label,
  path,
  icon: Icon,
  count,
  loading,
  isActive,
  onClick,
}: SidebarItemProps) => {
  return (
    <Link to={path} onClick={onClick}>
      <SidebarMenuButton
        tooltip={label}
        className={cn(
          "flex justify-between items-center h-11 transition-colors duration-700 cursor-pointer",
          isActive
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent hover:text-accent-foreground",
        )}
      >
        <div className="flex flex-row justify-center items-center gap-2">
          <Icon />
          {label}
        </div>
        {typeof count === "number" ? (
          loading ? (
            <Loading size="small" />
          ) : (
            <Badge
              variant="secondary"
              className="px-1 rounded-full min-w-5 h-5 font-bold tabular-nums"
            >
              {count}
            </Badge>
          )
        ) : null}
      </SidebarMenuButton>
    </Link>
  );
};

export default AppSidebar;
