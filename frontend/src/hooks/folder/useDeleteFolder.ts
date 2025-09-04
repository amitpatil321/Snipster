import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import type { RootState } from "@/store";
import type { Folder } from "@/types/folder.types";
import type { AxiosError } from "axios";

import { ROUTES } from "@/config/routes.config";
import { deleteFolder } from "@/services/folder.services";
import { unlinkFolder } from "@/utils/queryCache.utils";

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const currentPage = useSelector((state: RootState) => state.app.currentPage);

  return useMutation({
    mutationFn: (payload: Folder) => deleteFolder({ folderId: payload._id }),
    onMutate: (payload: Folder) => {
      const foldersQueryKey = ["getFolders"];
      queryClient.cancelQueries({ queryKey: foldersQueryKey });
      // take backup of folders
      const folders = queryClient.getQueryData<{ data: Folder[] }>(
        foldersQueryKey,
      );

      if (folders) {
        // remove folder from the cache
        queryClient.setQueryData<{ data: Folder[] }>(foldersQueryKey, {
          data: folders?.data.filter((each) => each._id !== payload._id),
        });
      }

      unlinkFolder(
        queryClient,
        ["getSnippets", currentPage?.type],
        payload._id,
      );

      // remove cache for that folder
      if (currentPage?.type === "folder") {
        // since we will be redirected to all page so lets prepare it :)
        unlinkFolder(queryClient, ["getSnippets", "all"], payload._id);
        queryClient.removeQueries({
          queryKey: ["folderSnippets", payload._id],
        });
        // navigate to "/all"
        navigate(ROUTES.ALL);
      }

      return { folders };
    },
    onError: (_err, _payload, context) => {
      const err = _err as AxiosError<{ message?: string }>;
      toast.error(
        err?.response?.data?.message ||
          "Failed to delete folder. Please try again.",
      );
      // dump copy of folder in cache
      if (context?.folders) {
        queryClient.setQueryData<{ data: Folder[] }>(["getFolders"], (old) => {
          if (!old) return old;
          return context.folders;
        });
      }
    },
  });
};
