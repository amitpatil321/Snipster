import { useQuery } from "@tanstack/react-query";

import { getSnippetsByUser } from "@/services/snippet.service";
import { type Snippet } from "@/types/snippet.types";

interface GetSnippetResponse {
  data: Snippet[];
}

export const useGetSnippets = (
  type: string | undefined,
  folderId?: string | null,
) => {
  return useQuery<GetSnippetResponse, Error, Snippet[]>({
    queryKey: ["getSnippets", type, folderId ?? null],
    enabled: !!type && (type !== "folder" || !!folderId),
    queryFn: () => getSnippetsByUser(type, folderId ?? null),
    select: (res) => res.data,
  });
};

// export const useGetSnippets = (type: string, folderId?: string | null) => {
//   console.log(type, folderId);
//   return useQuery<GetSnippetResponse, Error, Snippet[]>({
//     queryKey: ["getSnippets", type as "all" | "favorite" | "trash", folderId],
//     enabled: !!type && (type !== "folder" || !!folderId),
//     queryFn: () => getSnippetsByUser(type, folderId ?? null),
//     select: (res) => res.data,
//   });
// };

export default useGetSnippets;
