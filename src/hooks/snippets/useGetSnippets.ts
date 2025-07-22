import { useQuery } from "@tanstack/react-query";
import { getSnippetsByUser } from "services/snippet.service";

import type Snippet from "types/snippet";

interface GetSnippetResponse {
  data: Snippet[];
}

export const useGetSnippets = () => {
  return useQuery<GetSnippetResponse, Error, Snippet[]>({
    queryKey: ["getSnippets"],
    queryFn: (): Promise<GetSnippetResponse> => {
      return getSnippetsByUser();
    },
    select: (res: GetSnippetResponse) => res.data,
  });
};

export default useGetSnippets;
