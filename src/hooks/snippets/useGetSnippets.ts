import { useQuery } from "@tanstack/react-query";
import { getSnippetsByUser } from "services/snippet.service";
import { type Snippet } from "types/snippet.types";

interface GetSnippetResponse {
  data: Snippet[];
}

export const useGetSnippets = (type: string) => {
  return useQuery<GetSnippetResponse, Error, Snippet[]>({
    queryKey: ["getSnippets", type as "all" | "favorite" | "trash"],
    enabled: !!type.length,
    queryFn: () => getSnippetsByUser(type),
  });
};

export default useGetSnippets;
