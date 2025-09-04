import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import type { RootState } from "@/store";
import type { AxiosError } from "axios";

import { moveToFolder } from "@/services/snippet.service";
import {
  cancelQueries,
  getSnapshot,
  toggleMoveToFolder,
} from "@/utils/queryCache.utils";

const useMoveToFolder = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  const currentPage = useSelector((state: RootState) => state.app.currentPage);

  const affectedKeys = ["all", "favorite"];

  return useMutation({
    mutationFn: ({
      snippetIds,
      folderId,
    }: {
      snippetIds: string[];
      folderId: string;
    }) => moveToFolder({ snippetIds, folderId }),
    onMutate: async (payload) => {
      const { snippetIds, folderId } = payload;

      await cancelQueries(queryClient, affectedKeys);
      const previousData = getSnapshot(queryClient, affectedKeys);

      toggleMoveToFolder(queryClient, snippetIds, folderId, currentPage?.type);

      return { previousData };
    },
    onError: (_err, _payload, context) => {
      const listQueryKey = ["getSnippets", "all", null];
      const favQueryKey = ["getSnippets", "favorite", null];
      const foldersKey = ["getSnippets", "folder", _payload.folderId];

      const err = _err as AxiosError<{ message?: string }>;

      toast.error(
        err?.response?.data?.message ||
          "Failed to move snippets. Please try again.",
      );

      if (context?.previousData) {
        queryClient.setQueryData(listQueryKey, context.previousData.list);
        queryClient.setQueryData(favQueryKey, context.previousData.favorite);
        // queryClient.setQueryData(foldersQueryKey, context.previousData.counts);
        queryClient.setQueryData(foldersKey, context.previousData.folders);
      }
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
  });
};

export default useMoveToFolder;
