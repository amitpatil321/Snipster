import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { notify } from "lib/notify";
import { toast } from "react-toastify";
import { toggleRemove } from "services/snippet.service";
import { type Snippet, type SnippetCountType } from "types/snippet.types";

export const useToggleRemove = (
  snippet: Snippet,
  type: string | undefined,
  folderId?: string | null,
  options?: {
    onSuccess?: () => void;
  },
) => {
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
      const queryKey = ["getSnippets", type, folderId];
      const trashKey = ["getSnippets", "trash", folderId];
      const allKey = ["getSnippets", "all", folderId];
      const favKey = ["getSnippets", "favorite"];
      const countKey = ["snippetCounts"];

      await queryClient.cancelQueries({ queryKey });

      const previousSnippets = queryClient.getQueryData<Snippet[]>(queryKey);

      const isDeleting = snippet.deletedAt === null; // true if we are now deleting it
      const wasFavorite = snippet.favorite;

      if (isDeleting) {
        // Remove from current view
        queryClient.setQueryData<{ data: Snippet[] }>(queryKey, (old) => {
          return {
            data: old?.data?.filter((s) => s._id !== snippet._id) ?? [],
          };
        });

        queryClient.setQueryData<{ data: Snippet[] }>(trashKey, (old) => {
          return {
            data: [
              ...(old?.data ?? []),
              {
                ...snippet,
                deletedAt: new Date(),
                favorite: false,
              },
            ],
          };
        });

        // Remove from favorites
        if (wasFavorite) {
          queryClient.setQueryData<{ data: Snippet[] }>(favKey, (old) => ({
            data: old?.data?.filter((s) => s._id !== snippet._id) ?? [],
          }));
        }

        // Update counts
        queryClient.setQueryData<{ data: SnippetCountType }>(countKey, (old) =>
          old?.data
            ? {
                data: {
                  ...old?.data,
                  all: old.data?.all - 1,
                  trash: old.data?.trash + 1,
                  favorite: wasFavorite
                    ? old.data.favorite - 1
                    : old.data.favorite,
                },
              }
            : {
                data: {
                  all: 0,
                  trash: 1,
                  favorite: wasFavorite ? 0 : 0,
                },
              },
        );
      } else {
        // Restore from trash
        queryClient.setQueryData<{ data: Snippet[] }>(trashKey, (old) => ({
          data: old?.data?.filter((s) => s._id !== snippet._id) ?? [],
        }));

        // Add back to "all"
        queryClient.setQueryData<{ data: Snippet[] }>(allKey, (old) => ({
          data: [...(old?.data ?? []), { ...snippet, deletedAt: undefined }],
        }));

        // Update counts
        queryClient.setQueryData<{ data: SnippetCountType }>(countKey, (old) =>
          old?.data
            ? {
                data: {
                  ...old.data,
                  trash: old.data.trash - 1,
                  all: old.data.all + 1,
                },
              }
            : { data: { all: 1, trash: 0, favorite: 0 } },
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
    onSuccess: () => {
      options?.onSuccess?.();
    },
  });
};

export default useToggleRemove;
