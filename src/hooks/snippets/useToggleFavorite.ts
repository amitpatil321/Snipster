import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { notify } from "lib/notify";
import { toast } from "react-toastify";
import { toggleFavorite } from "services/snippet.service";
import { type Snippet, type SnippetCountType } from "types/snippet.types";

import type { AxiosError } from "axios";

export const useToggleFavorite = (
  snippet: Snippet,
  type: string | undefined,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleFavorite(snippet._id),
    onMutate: async () => {
      const listQueryKey = ["getSnippets", type];
      const favQueryKey = ["getSnippets", "favorite"];
      const countsQuery = ["snippetCounts"];

      await queryClient.cancelQueries({ queryKey: listQueryKey });

      const allSnippets = queryClient.getQueryData<Snippet[]>(listQueryKey);

      if (!snippet) return { allSnippets };

      snippet.favorite = !snippet.favorite;

      const isFav = snippet.favorite;
      const updateCount = (delta: number) =>
        queryClient.setQueryData<SnippetCountType>(countsQuery, (old) =>
          old
            ? { ...old, favorite: old.favorite + delta }
            : { all: 0, favorite: delta, trash: 0 },
        );

      queryClient.setQueryData<Snippet[]>(favQueryKey, (oldFavs = []) =>
        isFav
          ? [...oldFavs, snippet]
          : oldFavs.filter((s) => s._id !== snippet._id),
      );

      updateCount(isFav ? 1 : -1);

      return { allSnippets };
    },
    onError: (_err) => {
      const err = _err as AxiosError<{ message?: string }>;

      toast.error(
        err?.response?.data?.message ||
          "Failed to update status. Please try again.",
      );
      queryClient.invalidateQueries({ queryKey: ["getSnippets", "all"] });
      queryClient.invalidateQueries({
        queryKey: ["getSnippets", "favorite"],
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
