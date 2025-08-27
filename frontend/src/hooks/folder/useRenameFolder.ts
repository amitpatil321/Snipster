import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import type { RootState } from "@/store";
import type { Folder } from "@/types/folder.types";
import type { AxiosError } from "axios";

import { renameFolder } from "@/services/folder.services";
import { toggleRenameFolder } from "@/store/app/appSlice";
import { updateFolderName } from "@/utils/queryCache.utils";

// interface RenameFolderResponse {
//   success: boolean;
//   message: string;
//   data: {
//     id: string;
//   };
// }

interface Payload {
  id: string;
  name: string;
}

export const useRenameFolder = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const currentPage = useSelector((state: RootState) => state.app.currentPage);

  return useMutation({
    mutationFn: (payload: Payload) => renameFolder(payload),
    onMutate: (payload: Payload) => {
      const foldersQueryKey = ["getFolders"];
      queryClient.cancelQueries({ queryKey: foldersQueryKey });
      // take backup of folders
      const folders = queryClient.getQueryData<{ data: Folder[] }>(
        foldersQueryKey,
      );
      // close modal
      dispatch(toggleRenameFolder(null));
      // find folder by id and rename it
      if (folders?.data) {
        const updated = [...folders.data]?.map((folder: Folder) =>
          folder._id === payload.id
            ? { ...folder, name: payload.name, optimistic: true }
            : folder,
        );
        queryClient.setQueryData(foldersQueryKey, { data: updated });
      }

      return { folders };
    },
    onError: (_err, _payload, context) => {
      const err = _err as AxiosError<{ message?: string }>;
      toast.error(
        err?.response?.data?.message ||
          "Failed to rename folder. Please try again.",
      );
      if (context?.folders) {
        queryClient.setQueryData<{ data: Folder[] }>(
          ["getFolders"],
          context.folders,
        );
      }
    },
    onSuccess: (_response, payload, context) => {
      // refeach current snipepts on path
      if (context.folders) {
        const updated = [...context.folders.data]?.map((folder: Folder) =>
          folder._id === payload.id
            ? { ...folder, name: payload.name, optimistic: false }
            : folder,
        );
        if (context?.folders) {
          queryClient.setQueryData<{ data: Folder[] }>(["getFolders"], {
            data: updated,
          });
        }
      }

      const queryKey =
        currentPage?.type === "folder"
          ? ["getSnippets", "folder", currentPage.path]
          : ["getSnippets", currentPage?.type, null];

      updateFolderName(queryClient, queryKey, payload.id, payload.name);
    },
  });
};
