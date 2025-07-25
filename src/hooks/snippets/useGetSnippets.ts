import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getSnippetsByUser } from "services/snippet.service";
import { selectAuthUserId } from "store/auth/authSelectors";
import { type Snippet } from "types/snippet.types";

interface GetSnippetResponse {
  data: Snippet[];
}

export const useGetSnippets = () => {
  const userId = useSelector(selectAuthUserId);
  return useQuery<GetSnippetResponse, Error, Snippet[]>({
    queryKey: ["getSnippets", userId],
    enabled: !!userId,
    queryFn: getSnippetsByUser,
    select: (res: GetSnippetResponse) => res.data,
  });
};

export default useGetSnippets;
