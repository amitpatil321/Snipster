import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { notify } from "lib/notify";
import { toast } from "react-toastify";
import { makeFavorite } from "services/snippet.service";
import { type Snippet } from "types/snippet.types";

export const useToggleFavorite = (
  snippet: Snippet,
  type: string | undefined,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => makeFavorite(snippet._id, !snippet.favorite),
    onMutate: async () => {
      const queryKey = ["getSnippets", type];
      await queryClient.cancelQueries({ queryKey });
      const previousSnippets = queryClient.getQueryData<Snippet[]>(queryKey);

      queryClient.setQueryData<Snippet[]>(
        queryKey,
        (old) =>
          old?.map((s) =>
            s._id === snippet._id ? { ...s, favorite: !s.favorite } : s,
          ) ?? [],
      );
      // add/remove snippet from favorites cache
      return { previousSnippets };
    },
    onError: (_err, _variables, context) => {
      toast.error("Failed to update favorite. Please try again.");
      const queryKey = ["getSnippets", type];
      if (context?.previousSnippets) {
        queryClient.setQueryData(queryKey, context.previousSnippets);
      }
    },
    onSettled: () => {
      // Invalidate favorites query
      queryClient.invalidateQueries({ queryKey: ["getSnippets", "favorite"] });
    },
  });
};

export default useToggleFavorite;
