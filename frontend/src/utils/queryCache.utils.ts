import { type QueryClient } from "@tanstack/react-query";

import type { Snippet, SnippetCountType } from "@/types/snippet.types";

const trashKey = ["getSnippets", "trash"];
const listKey = ["getSnippets", "all"];
const favKey = ["getSnippets", "favorite"];
// const countsKey = ["snippetCounts"];

/****** New code ******/
export const cancelQueries = async (
  queryClient: QueryClient,
  keys: string[],
) => {
  await Promise.all(
    keys.map((eachKey) =>
      queryClient.cancelQueries({ queryKey: ["getSnippets", eachKey] }),
    ),
  );
};
export const deleteSnippets = (
  queryClient: QueryClient,
  type: string | undefined,
  ids: string[],
) => {
  if (type === "all") {
    updateSnippetProperty(queryClient, listKey, ids, {
      deletedAt: new Date(),
    });
    moveSnippet(queryClient, listKey, trashKey, ids);
    updateCount(queryClient, "all", -ids.length);
    updateCount(queryClient, "trash", ids.length);
  } else if (type === "favorite") {
    updateSnippetProperty(queryClient, favKey, ids, {
      deletedAt: new Date(),
    });
    moveSnippet(queryClient, favKey, trashKey, ids);
    // since fav snippets are also part of all snipepts, lets move them
    moveSnippet(queryClient, listKey, trashKey, ids);
    updateCount(queryClient, "all", -ids.length);
    updateCount(queryClient, "favorite", -ids.length);
    updateCount(queryClient, "trash", ids.length);
  } else {
    updateSnippetProperty(queryClient, trashKey, ids, {
      deletedAt: null,
    });

    moveSnippet(queryClient, trashKey, listKey, ids);
    updateCount(queryClient, "all", ids.length);
    updateCount(queryClient, "trash", -ids.length);
  }
};
export const getSnapshot = (
  queryClient: QueryClient,
  keys: string[],
): Record<string, unknown> => {
  const snapshot: Record<string, unknown> = {};

  keys.forEach((eachKey) => {
    snapshot[eachKey] = queryClient.getQueryData(["getSnippets", eachKey]);
  });

  return snapshot;
};

export const setSnapshot = (
  queryClient: QueryClient,
  keys: string[],
  data: Record<string, unknown> | undefined,
) => {
  const snapshot: Record<string, unknown> = {};
  if (data)
    keys.forEach((eachKey) => {
      snapshot[eachKey] = queryClient.setQueryData(
        ["getSnippets", eachKey],
        data[eachKey],
      );
    });
};

export const toggleFavoriteSnippet = (
  queryClient: QueryClient,
  type: string | undefined,
  ids: string[],
  status: boolean,
) => {
  updateSnippetProperty(queryClient, ["getSnippets", type], ids, {
    favorite: status,
  });

  if (status) {
    copySnippetFromTo(queryClient, listKey, favKey, ids);
    updateCount(queryClient, "favorite", ids.length);
  } else {
    updateSnippetProperty(queryClient, ["getSnippets", "all"], ids, {
      favorite: status,
    });
    removeSnippetsFromList(queryClient, favKey, ids);
    updateCount(queryClient, "favorite", -ids.length);
  }
};

export const updateCount = (
  queryClient: QueryClient,
  key: keyof SnippetCountType,
  count: number,
) => {
  queryClient.setQueryData<{ data: SnippetCountType }>(
    ["snippetCounts"],
    (old) => {
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
    },
  );
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

export const addSnippetWithData = (
  queryClient: QueryClient,
  queryKey: (string | null)[],
  data: Snippet,
) => {
  queryClient.setQueryData<{ data: Snippet[] }>(queryKey, (old) => {
    if (!old) return old;
    return {
      ...old,
      data: [...old.data, data],
    };
  });
};

export const addSnippetsToList = (
  queryClient: QueryClient,
  queryKey: (string | null)[],
  ids: string[],
) => {
  if (queryClient.getQueryData<{ data: Snippet[] }>(queryKey)) {
    queryClient.setQueryData<{ data: Snippet[] }>(queryKey, (old) => ({
      data: (old?.data ?? []).filter((snippet) => !ids.includes(snippet._id)),
    }));
  }
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
