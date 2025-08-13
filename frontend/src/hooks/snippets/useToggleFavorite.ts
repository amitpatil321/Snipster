import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import type { AxiosError } from "axios";

import { toggleFavorite } from "@/services/snippet.service";
import { type Snippet, type SnippetCountType } from "@/types/snippet.types";

export const useToggleFavorite = (
  snippet: Snippet,
  type: string | undefined,
  folderId?: string | null,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleFavorite(snippet._id),
    onMutate: async () => {
      const listQueryKey = ["getSnippets", type, folderId];
      const favQueryKey = ["getSnippets", "favorite", folderId];
      const countsQuery = ["snippetCounts"];

      await queryClient.cancelQueries({ queryKey: listQueryKey });

      const allSnippets = queryClient.getQueryData<Snippet[]>(listQueryKey);

      if (!snippet) return { allSnippets };

      snippet.favorite = !snippet.favorite;

      const isFav = snippet.favorite;
      const updateCount = (delta: number) =>
        queryClient.setQueryData<{ data: SnippetCountType }>(
          countsQuery,
          (old) =>
            old
              ? { data: { ...old.data, favorite: old.data.favorite + delta } }
              : { data: { all: 0, favorite: delta, trash: 0 } },
        );

      queryClient.setQueryData<{ data: Snippet[] }>(listQueryKey, (old) => ({
        data: (old?.data ?? []).map((each) =>
          each._id === snippet._id ? { ...each, favorite: isFav } : each,
        ),
      }));

      queryClient.setQueryData<{ data: Snippet[] }>(favQueryKey, (oldFavs) =>
        isFav
          ? { data: [...(oldFavs?.data || []), snippet] }
          : { data: oldFavs?.data.filter((s) => s._id !== snippet._id) || [] },
      );

      updateCount(isFav ? 1 : -1);

      return { allSnippets, type, folderId };
    },
    onError: (_err, _variables, context) => {
      const err = _err as AxiosError<{ message?: string }>;

      toast.error(
        err?.response?.data?.message ||
          "Failed to update status. Please try again.",
      );
      queryClient.invalidateQueries({
        queryKey: ["getSnippets", context?.type, context?.folderId],
      });
      queryClient.invalidateQueries({
        queryKey: ["getSnippets", "favorite", folderId],
      });
      queryClient.invalidateQueries({ queryKey: ["snippetCounts"] });
    },
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ["getSnippets", "all"] });
    //   queryClient.invalidateQueries({ queryKey: ["getSnippets", "favorite"] });
    //   queryClient.invalidateQueries({ queryKey: ["snippetCounts"] });
    // },
  });
};

export default useToggleFavorite;
