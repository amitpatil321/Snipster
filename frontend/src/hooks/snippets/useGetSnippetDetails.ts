import { useQuery } from "@tanstack/react-query";

import { getSnippetDetails } from "@/services/snippet.service";

export const useGetSnipeptDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ["getSnippetDetails", id],
    enabled: !!id,
    queryFn: () => getSnippetDetails(id),
    select: (res) => res.data,
  });
};
