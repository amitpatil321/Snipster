import { useQuery } from "@tanstack/react-query";

import { getUserSnippetsByFolder } from "@/services/snippet.service";
import { type Snippet } from "@/types/snippet.types";

interface GetSnippetResponse {
  data: Snippet[];
}

export const useGetFolderSnippets = (folderId: string | undefined) => {
  return useQuery<GetSnippetResponse, Error, Snippet[]>({
    queryKey: ["folderSnippets", folderId],
    enabled: !!folderId,
    queryFn: () => getUserSnippetsByFolder(folderId),
    select: (res) => res.data,
  });
};

export default useGetFolderSnippets;
