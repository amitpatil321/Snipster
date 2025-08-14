import { bulkFavorites } from "@/services/snippet.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface BulkFavType {
  ids: string[];
  status: boolean;
}

export const useBulkFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkFavType) => bulkFavorites(data),
    onMutate: async () => {
      //   const listQueryKey = ["getSnippets", type, folderId];
      //   await queryClient.cancelQueries({ queryKey: listQueryKey });
      //   const allSnippets = queryClient.getQueryData<Snippet[]>(listQueryKey);
    },
    onError: (_err, _variables, context) => {},
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ["getSnippets", "all"] });
    //   queryClient.invalidateQueries({ queryKey: ["getSnippets", "favorite"] });
    //   queryClient.invalidateQueries({ queryKey: ["snippetCounts"] });
    // },
  });
};

export default useBulkFavorites;
