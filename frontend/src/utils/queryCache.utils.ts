import type { Snippet, SnippetCountType } from "@/types/snippet.types";
import type { QueryClient } from "@tanstack/react-query";

export const updateFavCount = (
  queryClient: QueryClient,
  queryKey: string[],
  count: number,
) => {
  queryClient.setQueryData<{ data: SnippetCountType }>(queryKey, (old) => ({
    data: {
      all: old?.data.all || 0,
      favorite: (old?.data.favorite ?? 0) + (count ?? 0),
      trash: old?.data.trash || 0,
    },
  }));
};

export const removeSnippetsFromList = (
  queryClient: QueryClient,
  queryKey: (string | null)[],
  ids: string[],
) => {
  queryClient.setQueryData<{ data: Snippet[] }>(queryKey, (old) => ({
    data: (old?.data ?? []).filter((snippet) => !ids.includes(snippet._id)),
  }));
};

export const updateSnippetProperty = (
  queryClient: QueryClient,
  queryKey: (string | null)[],
  ids: string[],
  updates: Partial<Snippet>,
) => {
  const data = queryClient.getQueryData<{ data: Snippet[] }>(queryKey)?.data;
  if (!data) return;

  const modified = data.map((snippet) =>
    ids.includes(snippet._id) ? { ...snippet, ...updates } : snippet,
  );

  queryClient.setQueryData<{ data: Snippet[] }>(queryKey, { data: modified });
};

export const addSnippetstoFavorites = (
  queryClient: QueryClient,
  queryKey: (string | null)[],
  favQueryKey: (string | null)[],
  ids: string[],
) => {
  const allsnippets = queryClient.getQueryData<{ data: Snippet[] }>(
    queryKey,
  )?.data;
  const allfav = queryClient.getQueryData<{ data: Snippet[] }>(
    favQueryKey,
  )?.data;

  if (!allsnippets) return;

  const modified = [
    ...(allfav ?? []),
    ...(allsnippets ?? []).filter((snippet) => ids.includes(snippet._id)),
  ];

  queryClient.setQueryData<{ data: Snippet[] }>(favQueryKey, {
    data: modified,
  });
};
