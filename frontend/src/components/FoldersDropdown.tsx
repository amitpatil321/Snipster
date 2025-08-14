import { FolderIcon, Forward } from "lucide-react";

import { Alert } from "./Alert";
import Loading from "./Loading";
import { Button } from "./ui/button";

import type { Folder } from "@/types/folder.types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetFolders } from "@/hooks/user/useGetFolders";

const FoldersDropdown = () => {
  const { data: foldersList, isLoading, isError } = useGetFolders();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs cursor-pointer">
          <Forward />
          Move to
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          {isLoading && <Loading size="small" />}
          {isError && <Alert title="Error fetching folders" />}
          {!isLoading &&
            (foldersList ?? [])?.map(({ _id, name }: Folder) => {
              return (
                <DropdownMenuItem key={_id} className="font-sans">
                  <FolderIcon size="10" />
                  {name}
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FoldersDropdown;
