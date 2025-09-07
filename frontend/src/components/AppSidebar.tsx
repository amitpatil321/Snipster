import {
  EllipsisVertical,
  Folder as FolderIcon,
  Heart,
  List,
  Plus,
  SquarePen,
  Trash,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useSearchParams } from "react-router";

import { ConfirmDeleteDialog } from "./ConfirmDialogue";
import Loading from "./Loading";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
import { useDeleteFolder } from "@/hooks/folder/useDeleteFolder";
import { cn } from "@/lib/utils";
import {
  setCurrentPage,
  toggleAddFolder,
  toggleRenameFolder,
} from "@/store/app/appSlice";

interface PropTypes {
  counts: SnippetCountType;
  loading: boolean;
  folders: Folder[];
  foldersLoading: boolean;
}

const AppSidebar = React.memo(
  ({ counts, loading, folders, foldersLoading }: PropTypes) => {
    const { all, favorite, trash } = counts || {};
    const { open } = useSidebar();
    const dispatch = useDispatch();
    const location = useLocation();
    const currentPage = useSelector(
      (state: RootState) => state.app.currentPage,
    );
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get(CONFIG.SEARCH_PARAM) || "";
    const { mutate: deleteFolderMutation } = useDeleteFolder();

    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
    const deleteFolder = () => {
      if (folderToDelete) {
        deleteFolderMutation(folderToDelete);
        setFolderToDelete(null);
      }
    };

    const items = useMemo(
      () => ({
        platform: [
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
        folders: folders || [],
      }),
      [all, favorite, trash, folders],
    );
    useEffect(() => {
      const currentPath = location.pathname;

      // Clear `q` only if NOT on "all" page
      if (searchQuery && !currentPath.startsWith("/all")) {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete(CONFIG.SEARCH_PARAM);
        setSearchParams(newParams);
      }

      const platform = items.platform.find(
        (each) => each.path === "/" + currentPath.split("/")?.[1],
      );
      const folder = items.folders.find(
        (each) => each._id === currentPath.split("/")?.[2],
      );

      if (platform || folder) {
        if (platform)
          dispatch(
            setCurrentPage({
              label: platform.label,
              path: platform.path,
              type: platform.path.split("/")?.[1],
            }),
          );
        else if (folder)
          dispatch(
            setCurrentPage({
              label: folder.name,
              path: folder._id,
              type: "folder",
            }),
          );
      }
    }, [
      location.pathname,
      items,
      dispatch,
      searchQuery,
      searchParams,
      setSearchParams,
    ]);

    return (
      <>
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="items-center mt-4 mb-4 text-2xl">
            {open && (
              <Link
                to={ROUTES.HOME}
                className="font-bold text-purple-600 dark:text-foreground text-2xl tracking-[1px]"
              >
                Snip
                <span className="text-muted-foreground">ster</span>
              </Link>
            )}
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarMenu>
                {items.platform.map((each) => (
                  <li key={each.label}>
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
                          setCurrentPage({
                            label: each.label,
                            path: each.path,
                          }),
                        )
                      }
                    />
                  </li>
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
                      onClick={() => dispatch(toggleAddFolder(true))}
                      aria-label="Add folder"
                    >
                      <Plus />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add folder</TooltipContent>
                </Tooltip>
              </SidebarGroupLabel>
              <SidebarMenu>
                {items.folders?.map((each) => (
                  <li key={each._id}>
                    <SidebarItem
                      key={each._id}
                      type="folder"
                      label={each.name}
                      path={`${CONFIG.PATHS.FOLDER}/${each._id}`}
                      icon={FolderIcon}
                      count={each.snippetCount}
                      optimistic={each.optimistic}
                      loading={foldersLoading}
                      isActive={currentPage?.label === each.name}
                      onClick={() =>
                        dispatch(
                          setCurrentPage({ label: each.name, path: each._id }),
                        )
                      }
                      openRenameModal={() =>
                        dispatch(
                          toggleRenameFolder({ id: each._id, name: each.name }),
                        )
                      }
                      setDeleteConfirm={(state) => {
                        setDeleteConfirm(state);
                        if (state) setFolderToDelete(each);
                      }}
                    />
                  </li>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <ConfirmDeleteDialog
          onConfirm={deleteFolder}
          onClose={setDeleteConfirm}
          open={deleteConfirm}
        />
      </>
    );
  },
);

interface SidebarItemProps {
  type?: string;
  label: string;
  path: string;
  icon: React.ElementType;
  count?: number;
  optimistic?: boolean;
  loading?: boolean;
  isActive: boolean;
  onClick: () => void;
  setDeleteConfirm?: (state: boolean) => void;
  openRenameModal?: () => void;
}

const SidebarItem = React.memo(
  ({
    type,
    label,
    path,
    icon: Icon,
    count,
    optimistic,
    loading,
    isActive,
    onClick,
    setDeleteConfirm,
    openRenameModal,
  }: SidebarItemProps) => {
    return (
      <Link
        to={path}
        onClick={(event) => {
          if (optimistic) {
            event.preventDefault();
            return;
          }
          onClick?.();
        }}
      >
        <SidebarMenuButton
          tooltip={label}
          className={cn(
            "flex justify-between items-center h-11 transition-colors duration-200 cursor-pointer",
            isActive
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent hover:text-accent-foreground",
            optimistic ? "cursor-not-allowed" : "",
          )}
        >
          <div className="flex flex-row justify-center items-center gap-2">
            <Icon />
            {optimistic ? <span className="opacity-50">{label}</span> : label}
          </div>
          <div className="flex flex-row justify-center items-center">
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
            {type === "folder" && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="folder actions"
                    className="opacity-30 font-sans text-muted-foreground cursor-pointer"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    aria-haspopup="menu"
                    aria-expanded="false"
                  >
                    <EllipsisVertical />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="font-sans">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      openRenameModal?.();
                    }}
                  >
                    <SquarePen /> Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setDeleteConfirm?.(true);
                    }}
                  >
                    <Trash /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </SidebarMenuButton>
      </Link>
    );
  },
);

export default AppSidebar;
