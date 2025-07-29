import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { notify } from "lib/notify";
import { toast } from "react-toastify";
import { toggleRemove } from "services/snippet.service";
import { type Snippet, type SnippetCountType } from "types/snippet.types";

export const useToggleRemove = (snippet: Snippet, type: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleRemove(snippet._id),
    // onMutate: async () => {
    //   const queryKey = ["getSnippets", type];
    //   const favQueryKey = ["getSnippets", "favorite"];
    //   await queryClient.cancelQueries({ queryKey });
    //   const previousSnippets = queryClient.getQueryData<Snippet[]>(queryKey);
    //   const countsQuery = ["snippetCounts"];

    //   const isDeleting = snippet.deletedAt === null ? true : false;
    //   const isFavorite = snippet.favorite ? true : false;

    //   if (isDeleting) {
    //     queryClient.setQueryData<Snippet[]>(
    //       queryKey,
    //       (old) =>
    //         old?.filter((oldSnippet) => oldSnippet._id !== snippet._id) ?? [],
    //     );
    //     queryClient.setQueryData<Snippet[]>(["getSnippets", "trash"], (old) => [
    //       ...(old ?? []),
    //       snippet,
    //     ]);
    //   } else {
    //     // Remove snippet from "trash" and move to "all snippets"
    //     queryClient.setQueryData<Snippet[]>(["getSnippets", "trash"], (old) =>
    //       old?.filter((each) => each._id !== snippet._id),
    //     );
    //     queryClient.setQueryData<Snippet[]>(["getSnippets", "all"], (old) => [
    //       ...(old ?? []),
    //       snippet,
    //     ]);
    //   }

    //   // if favorite snippet is deleted then it should be removed from favorites
    //   if (isFavorite) {
    //     queryClient.setQueryData<Snippet[]>(favQueryKey, (old) => {
    //       return old?.map((each) => {
    //         if (each._id === snippet._id) {
    //           return { ...each, favorite: false };
    //         } else return each;
    //       });
    //     });
    //   }

    //   const updateCount = (delta: number) =>
    //     queryClient.setQueryData<SnippetCountType | undefined>(
    //       countsQuery,
    //       (old) =>
    //         old
    //           ? { ...old, trash: old.trash + delta, all: old.all - delta }
    //           : { all: 0, favorite: 0, trash: delta },
    //     );

    //   updateCount(isDeleting ? 1 : -1);

    //   return { previousSnippets };
    // },
    onMutate: async () => {
      const queryKey = ["getSnippets", type];
      const trashKey = ["getSnippets", "trash"];
      const allKey = ["getSnippets", "all"];
      const favKey = ["getSnippets", "favorite"];
      const countKey = ["snippetCounts"];

      await queryClient.cancelQueries({ queryKey });

      const previousSnippets = queryClient.getQueryData<Snippet[]>(queryKey);

      const isDeleting = snippet.deletedAt === null; // true if we are now deleting it
      const wasFavorite = snippet.favorite;

      if (isDeleting) {
        // Remove from current view
        queryClient.setQueryData<Snippet[]>(
          queryKey,
          (old) => old?.filter((s) => s._id !== snippet._id) ?? [],
        );

        // Add to trash
        queryClient.setQueryData<Snippet[]>(trashKey, (old) => [
          ...(old ?? []),
          {
            ...snippet,
            deletedAt: new Date().toISOString(),
            favorite: false,
            code: "-",
          },
        ]);

        // Remove from favorites
        if (wasFavorite) {
          queryClient.setQueryData<Snippet[]>(
            favKey,
            (old) => old?.filter((s) => s._id !== snippet._id) ?? [],
          );
        }

        // Update counts
        queryClient.setQueryData<SnippetCountType>(countKey, (old) =>
          old
            ? {
                ...old,
                trash: old.trash + 1,
                all: old.all - 1,
                favorite: wasFavorite ? old.favorite - 1 : old.favorite,
              }
            : { all: 0, trash: 1, favorite: 0 },
        );
      } else {
        // Restore from trash
        queryClient.setQueryData<Snippet[]>(
          trashKey,
          (old) => old?.filter((s) => s._id !== snippet._id) ?? [],
        );

        // Add back to "all"
        queryClient.setQueryData<Snippet[]>(allKey, (old) => [
          ...(old ?? []),
          { ...snippet, deletedAt: undefined },
        ]);

        // Update counts
        queryClient.setQueryData<SnippetCountType>(countKey, (old) =>
          old
            ? {
                ...old,
                trash: old.trash - 1,
                all: old.all + 1,
                // Do not change favorite count on restore
              }
            : { all: 1, trash: 0, favorite: 0 },
        );
      }

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
      // const queryKey = ["getSnippets", "all"];
      // queryClient.invalidateQueries({ queryKey: ["getSnippets", "trash"] });
      // queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });
};

export default useToggleRemove;
