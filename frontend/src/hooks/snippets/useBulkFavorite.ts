import { bulkFavorites } from "@/services/snippet.service";
import type { Snippet } from "@/types/snippet.types";
import {
  addSnippetstoFavorites,
  removeSnippetsFromList,
  updateFavCount,
  updateSnippetProperty,
} from "@/utils/queryCache.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface BulkFavType {
  ids: string[];
  status: boolean;
}

export const useBulkFavorites = (
  type: string | undefined,
  setSelectedSnippets: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkFavType) => bulkFavorites(data),
    onMutate: async (payload) => {
      setSelectedSnippets([]);
      const listQueryKey = ["getSnippets", "all", null];
      const favQueryKey = ["getSnippets", "favorite", null];
      const countsKey = ["snippetCounts"];
      await queryClient.cancelQueries({ queryKey: listQueryKey });
      // Update all snipepts array
      const allSnippets = queryClient.getQueryData<{ data: Snippet[] }>(
        listQueryKey,
      )?.data;
      // Update favorites array
      const allFavSnippets = queryClient.getQueryData<{ data: Snippet[] }>(
        favQueryKey,
      );

      // handle case when user is on all snipepts page
      if (type === "all") {
        if (allSnippets) {
          updateSnippetProperty(queryClient, listQueryKey, payload.ids, {
            favorite: true,
          });
          updateFavCount(queryClient, countsKey, payload.ids.length || 0);
          // add snippets to fav list if cache already exists
          if (queryClient.getQueryData<{ data: Snippet[] }>(favQueryKey)) {
            console.log("fav cache available");
            addSnippetstoFavorites(
              queryClient,
              listQueryKey,
              favQueryKey,
              payload.ids,
            );
          }
        }
      } else {
        // handle case when user is on favorites page
        // lets remove snipepts from favorites list
        if (allFavSnippets !== undefined)
          removeSnippetsFromList(queryClient, favQueryKey, payload.ids);
        // remove favorite from all snippets list
        if (allSnippets)
          updateSnippetProperty(queryClient, listQueryKey, payload.ids, {
            favorite: false,
          });
        // Update counts
        updateFavCount(queryClient, countsKey, -payload.ids.length || 0);
      }
    },
    onError: (_err, _variables, context) => {},
    onSettled: (response, error, variables, context) => {
      if (response.success) {
        if (type === "all") {
          // queryClient.invalidateQueries({
          //   queryKey: ["getSnippets", "favorite", null],
          // });
        }
      }
      // queryClient.invalidateQueries({ queryKey: ["getSnippets", "all"] });
      // queryClient.invalidateQueries({
      //   queryKey: ["getSnippets", "favorite", null],
      // });
      // queryClient.invalidateQueries({ queryKey: ["snippetCounts"] });
    },
  });
};

export default useBulkFavorites;
