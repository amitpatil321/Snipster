import { useQuery } from "@tanstack/react-query";
import { getCounts } from "services/snippet.service";

export const useSnippetCounts = () => {
  return useQuery({ queryKey: ["snippetCounts"], queryFn: getCounts });
};
