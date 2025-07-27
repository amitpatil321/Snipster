import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { notify } from "lib/notify";
import { toast } from "react-toastify";
import { toggleRemove } from "services/snippet.service";
import { type Snippet } from "types/snippet.types";

export const useToggleRemove = (snippet: Snippet, type: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleRemove(snippet._id),
    onMutate: async () => {
      const queryKey = ["getSnippets", type];
      await queryClient.cancelQueries({ queryKey });
      const previousSnippets = queryClient.getQueryData<Snippet[]>(queryKey);

      queryClient.setQueryData<Snippet[]>(
        queryKey,
        (old) =>
          old?.filter((oldSnippet) => oldSnippet._id !== snippet._id) ?? [],
      );
      return { previousSnippets };
    },
    onError: (_err, _variables, context) => {
      toast.error("Failed to update status. Please try again.");
      const queryKey = ["getSnippets", type];
      if (context?.previousSnippets) {
        queryClient.setQueryData(queryKey, context.previousSnippets);
      }
    },
    onSettled: () => {
      // Invalidate deleted list
      const queryKey = ["getSnippets", "all"];
      queryClient.invalidateQueries({ queryKey: ["getSnippets", "trash"] });
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
};

export default useToggleRemove;
