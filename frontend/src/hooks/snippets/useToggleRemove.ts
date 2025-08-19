import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { toggleRemove } from "@/services/snippet.service";
import { type Snippet } from "@/types/snippet.types";
import {
  moveSnippet,
  updateCount,
  updateSnippetProperty,
} from "@/utils/queryCache.utils";

type Payload = { ids: string[]; status: boolean };

export const useToggleRemove = (
  // snippet: Snippet,
  type: string | undefined,
  folderId?: string | null,
  options?: {
    onSuccess?: () => void;
  },
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Payload) => toggleRemove(payload),
    onMutate: async (payload) => {
      const trashKey = ["getSnippets", "trash", folderId];
      const listKey = ["getSnippets", "all", folderId];
      const favKey = ["getSnippets", "favorite", folderId];
      const countKey = ["snippetCounts"];

      await Promise.all([
        queryClient.cancelQueries({ queryKey: listKey }),
        queryClient.cancelQueries({ queryKey: trashKey }),
        queryClient.cancelQueries({ queryKey: favKey }),
        queryClient.cancelQueries({ queryKey: countKey }),
      ]);

      // Capture snapshots for all lists
      const previousData = {
        list: queryClient.getQueryData<{ data: Snippet[] }>(listKey),
        trash: queryClient.getQueryData<{ data: Snippet[] }>(trashKey),
        favorite: queryClient.getQueryData<{ data: Snippet[] }>(favKey),
        counts: queryClient.getQueryData<{ data: Snippet[] }>(countKey),
      };

      if (type === "all") {
        moveSnippet(queryClient, listKey, trashKey, payload.ids);
        updateCount(queryClient, countKey, "all", -payload.ids.length);
        updateCount(queryClient, countKey, "trash", payload.ids.length);
      } else if (type === "favorite") {
        // remove favorite status from snipept
        updateSnippetProperty(queryClient, listKey, payload.ids, {
          favorite: false,
        });
        moveSnippet(queryClient, favKey, trashKey, payload.ids);
        // since snippets which are fav also part of "all", and now we are deleting it
        // so that we need to update "all" count also
        updateCount(queryClient, countKey, "all", -payload.ids.length);
        updateCount(queryClient, countKey, "favorite", -payload.ids.length);
        updateCount(queryClient, countKey, "trash", payload.ids.length);
      } else if (type === "trash") {
        moveSnippet(queryClient, trashKey, listKey, payload.ids);
        updateCount(queryClient, countKey, "all", payload.ids.length);
        updateCount(queryClient, countKey, "trash", -payload.ids.length);
      }

      return { previousData };
    },
    onError: (_err, _payload, context) => {
      const trashKey = ["getSnippets", "trash", folderId];
      const listKey = ["getSnippets", "all", folderId];
      const favKey = ["getSnippets", "favorite", folderId];
      const countKey = ["snippetCounts"];
      toast.error("Failed to remove snippet. Please try again.");
      if (context?.previousData) {
        queryClient.setQueryData(listKey, context.previousData.list);
        queryClient.setQueryData(trashKey, context.previousData.trash);
        queryClient.setQueryData(favKey, context.previousData.favorite);
        queryClient.setQueryData(countKey, context.previousData.counts);
      }
    },
    onSettled: () => {
      // Invalidate deleted list
      // const queryKey = ["getSnippets", "all"];
      // queryClient.invalidateQueries({ queryKey: ["getSnippets", "trash"] });
      // queryClient.invalidateQueries({ queryKey: queryKey });
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
  });
};

export default useToggleRemove;
