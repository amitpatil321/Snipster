import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import type { Snippet } from "@/types/snippet.types";
import type { AxiosError } from "axios";

import { toggleFavorite } from "@/services/snippet.service";
import {
  addSnippetsToList,
  copySnippetFromTo,
  removeSnippetsFromList,
  updateCount,
  updateSnippetProperty,
} from "@/utils/queryCache.utils";

type Payload = { ids: string[]; status: boolean };

const useToggleFavorite = (
  type: string | undefined,
  folderId?: string | null,
  setSelectedSnippets?: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Payload) => toggleFavorite(payload),
    onMutate: async (payload) => {
      const ids = payload.ids;
      const status = payload.status;

      if (setSelectedSnippets) setSelectedSnippets([]);

      const listQueryKey = ["getSnippets", "all", folderId || null];
      const favQueryKey = ["getSnippets", "favorite", folderId || null];
      const countsKey = ["snippetCounts"];

      await queryClient.cancelQueries({ queryKey: listQueryKey });

      const allSnippets = queryClient.getQueryData<{ data: Snippet[] }>(
        listQueryKey,
      )?.data;
      const allFavSnippets = queryClient.getQueryData<{ data: Snippet[] }>(
        favQueryKey,
      );

      if (type === "all") {
        if (allSnippets) {
          updateSnippetProperty(queryClient, listQueryKey, ids, {
            favorite: status,
          });
          updateCount(
            queryClient,
            countsKey,
            "favorite",
            status ? +ids.length : -ids.length,
          );
          if (allFavSnippets) {
            if (status)
              copySnippetFromTo(queryClient, listQueryKey, favQueryKey, ids);
            else removeSnippetsFromList(queryClient, favQueryKey, ids);
          }
        }
      } else {
        if (allFavSnippets)
          removeSnippetsFromList(queryClient, favQueryKey, ids);
        if (allSnippets) {
          updateSnippetProperty(queryClient, listQueryKey, ids, {
            favorite: false,
          });
        }
        updateCount(queryClient, countsKey, "favorite", -ids.length);
      }

      return { ids, status, type };
    },

    onError: (_err, _payload, context) => {
      const listQueryKey = ["getSnippets", "all", folderId || null];
      const favQueryKey = ["getSnippets", "favorite", folderId || null];
      const countsKey = ["snippetCounts"];
      const err = _err as AxiosError<{ message?: string }>;

      toast.error(
        err?.response?.data?.message ||
          "Failed to update status. Please try again.",
      );

      if (!context) return;

      if (context.type === "all") {
        updateSnippetProperty(queryClient, listQueryKey, context.ids, {
          favorite: false,
        });
        updateCount(queryClient, countsKey, "favorite", -context.ids.length);
        removeSnippetsFromList(queryClient, favQueryKey, context.ids);
      } else {
        if (queryClient.getQueryData<{ data: Snippet[] }>(favQueryKey)) {
          addSnippetsToList(queryClient, listQueryKey, context.ids);
        } else {
          queryClient.invalidateQueries({ queryKey: favQueryKey });
        }
        updateCount(queryClient, countsKey, "favorite", context.ids.length);
      }
    },

    onSettled: () => {
      // Optional: Invalidate queries if necessary
      // queryClient.invalidateQueries({ queryKey: ["snippetCounts"] });
    },
  });
};

export default useToggleFavorite;
