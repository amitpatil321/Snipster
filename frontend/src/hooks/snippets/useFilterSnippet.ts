import { useMemo } from "react";

import type { Snippet } from "@/types/snippet.types";

export const useFilteredSnippets = (snippets: Snippet[], query: string) => {
  return useMemo(() => {
    if (!query) return snippets;
    const lowerQuery = query.toLowerCase();
    return snippets.filter(
      (snippet) =>
        snippet.title.toLowerCase().includes(lowerQuery) ||
        snippet.description?.toLowerCase().includes(lowerQuery),
    );
  }, [snippets, query]);
};
