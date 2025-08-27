import type { Snippet, SnippetCountType } from "@/types/snippet.types";
import type { QueryClient } from "@tanstack/react-query";

export const updateCount = (
  queryClient: QueryClient,
  queryKey: (string | null | undefined)[],
  key: keyof SnippetCountType,
  count: number,
) => {
  queryClient.setQueryData<{ data: SnippetCountType }>(queryKey, (old) => {
    if (!old) {
      return {
        data: {
          all: 0,
          favorite: 0,
          trash: 0,
          [key]: count,
        },
      };
    }

    return {
      data: {
        ...old.data,
        [key]: (old.data[key] ?? 0) + (count ?? 0),
      },
    };
  });
};

export const removeSnippetsFromList = (
  queryClient: QueryClient,
  queryKey: (string | null | undefined)[],
  ids: string[],
) => {
  queryClient.setQueryData<{ data: Snippet[] }>(queryKey, (old) => ({
    data: (old?.data ?? []).filter((snippet) => !ids.includes(snippet._id)),
  }));
};

export const addSnippetsToList = (
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
  queryKey: (string | null | undefined)[],
  ids: string[],
  updates: Partial<Snippet>,
) => {
  const data = queryClient.getQueryData<{ data: Snippet[] }>(queryKey)?.data;
  if (!data) return;

  const modified = data.map((snippet) =>
    ids.includes(snippet._id) ? { ...snippet, ...updates } : snippet,
  );

  if (queryClient.getQueryData<{ data: Snippet[] }>(queryKey))
    queryClient.setQueryData<{ data: Snippet[] }>(queryKey, { data: modified });
};

export const copySnippetFromTo = (
  queryClient: QueryClient,
  sourceQueryKey: (string | null | undefined)[],
  destQueryKey: (string | null | undefined)[],
  ids: string[],
) => {
  const source = queryClient.getQueryData<{ data: Snippet[] }>(
    sourceQueryKey,
  )?.data;
  const destination = queryClient.getQueryData<{ data: Snippet[] }>(
    destQueryKey,
  )?.data;

  if (!source || !destination) return;

  // if query data doesnt exists ignore it
  if (queryClient.getQueryData<{ data: Snippet[] }>(destQueryKey)) {
    const modified = [
      ...(destination ?? []),
      ...(source ?? []).filter((snippet) => ids.includes(snippet._id)),
    ];
    queryClient.setQueryData<{ data: Snippet[] }>(destQueryKey, {
      data: modified,
    });
  }
};
export const moveSnippet = (
  queryClient: QueryClient,
  sourceQueryKey: (string | null | undefined)[],
  destQueryKey: (string | null | undefined)[],
  ids: string[],
) => {
  const source = queryClient.getQueryData<{ data: Snippet[] }>(
    sourceQueryKey,
  )?.data;
  const destination =
    queryClient.getQueryData<{ data: Snippet[] }>(destQueryKey)?.data || [];

  if (!source) return;

  // remove from source
  if (queryClient.getQueryData<{ data: Snippet[] }>(sourceQueryKey)) {
    queryClient.setQueryData<{ data: Snippet[] }>(sourceQueryKey, {
      data: source.filter((snippet) => !ids.includes(snippet._id)),
    });
  }

  if (queryClient.getQueryData<{ data: Snippet[] }>(destQueryKey)) {
    queryClient.setQueryData<{ data: Snippet[] }>(destQueryKey, () => {
      const filtered = source.filter((snippet) => ids.includes(snippet._id));
      return {
        data: [...destination, ...filtered],
      };
    });
  }
};

export const updateFolderName = (
  queryClient: QueryClient,
  queryKey: (string | null | undefined)[],
  id: string,
  newName: string | null,
) => {
  queryClient.setQueryData<{ data: Snippet[] }>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      data: oldData.data.map((snippet: Snippet) => {
        if (
          snippet.folderId &&
          snippet.folderId._id === id &&
          newName !== null
        ) {
          snippet.folderId = {
            ...snippet.folderId,
            name: newName,
          };
        }
        return snippet;
      }),
    };
  });
};

export const unlinkFolder = (
  queryClient: QueryClient,
  queryKey: (string | null | undefined)[],
  id: string,
) => {
  queryClient.setQueryData<{ data: Snippet[] }>(queryKey, (old) => {
    if (!old) return old;

    return {
      ...old,
      data: old.data.map((snippet) => {
        if (snippet.folderId?._id === id) {
          return {
            ...snippet,
            folderId: undefined,
          };
        }
        return snippet;
      }),
    };
  });
};
