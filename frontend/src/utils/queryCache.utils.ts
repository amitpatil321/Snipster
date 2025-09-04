import { type QueryClient } from "@tanstack/react-query";

import type { Folder } from "@/types/folder.types";
import type { Snippet, SnippetCountType } from "@/types/snippet.types";

const trashKey = ["getSnippets", "trash"];
const listKey = ["getSnippets", "all"];
const favKey = ["getSnippets", "favorite"];
const foldersQueryKey = ["getFolders"];

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
    // remove snippets from all snipepts to trash
    moveSnippet(queryClient, listKey, trashKey, ids);
    // remove snipepts from fav as well
    removeSnippetsFromList(queryClient, favKey, ids);
    updateCount(queryClient, "all", -ids.length);
    updateCount(queryClient, "favorite", -ids.length);
    updateCount(queryClient, "trash", ids.length);
  } else if (type === "favorite") {
    updateSnippetProperty(queryClient, favKey, ids, {
      deletedAt: new Date(),
      favorite: false,
    });
    moveSnippet(queryClient, favKey, trashKey, ids);
    // since fav snippets are also part of all snipepts, lets move them
    removeSnippetsFromList(queryClient, listKey, ids);
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
): Record<
  string,
  | {
      data?: Snippet[] | { all: number; favorite: number; trash: number };
    }
  | undefined
> => {
  const snapshot: Record<string, { data?: Snippet[] }> = {};

  keys.forEach((eachKey) => {
    snapshot[eachKey] =
      queryClient.getQueryData<{ data?: Snippet[] }>([
        "getSnippets",
        eachKey,
      ]) || {};
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

export const toggleMoveToFolder = (
  queryClient: QueryClient,
  snippetIds: string[],
  folderId: string,
  from: string | undefined,
) => {
  const folders = queryClient.getQueryData<{ data: Folder[] }>(foldersQueryKey);
  const folderDetails = folders?.data?.find((each) => each._id === folderId);
  const previousData = getSnapshot(queryClient, ["all", "favorite"]);

  updateSnippetProperty(queryClient, ["getSnippets", from], snippetIds, {
    folderId: folderDetails,
  });

  // console.log(["getSnippets", from]);

  // queryClient.setQueryData<{ data: Snippet[] }>(
  //   ["getSnippets", from],
  //   (old) => {
  //     if (!old) return old;
  //     return {
  //       ...old,
  //       data: old.data?.map((snippet: Snippet) => {
  //         if (snippetIds.includes(snippet._id)) {
  //           snippet.folderId = folderDetails;
  //         }
  //         return snippet;
  //       }),
  //     };
  //   },
  // );

  // Calculate previous folder counts and which snippets are moving
  let previousFolderSnippets = Array.isArray(previousData?.all?.data)
    ? previousData.all.data.filter((each: Snippet) =>
        snippetIds.includes(each._id),
      )
    : [];
  previousFolderSnippets = previousFolderSnippets?.filter(
    (each: Snippet) => each.folderId?._id !== folderId,
  );

  // Remove snippets from their source folder caches
  previousFolderSnippets?.forEach((snippet: Snippet) => {
    const sourceFolderId = snippet.folderId?._id;
    if (!sourceFolderId) return;

    const sourceKey = ["getSnippets", "folder", sourceFolderId];
    const sourceData = queryClient.getQueryData<{ data: Snippet[] }>(sourceKey);

    if (sourceData) {
      if (queryClient.getQueryData(sourceKey))
        queryClient.setQueryData(sourceKey, {
          data: sourceData.data.filter((s) => !snippetIds.includes(s._id)),
        });
    }
  });

  const foldersKey = ["getFolders"];

  // Add snippets to destination folder cache
  const destinationData = queryClient.getQueryData<{ data: Snippet[] }>([
    "getFolders",
  ]);

  const movedSnippets = previousFolderSnippets?.map((snippet) => ({
    ...snippet,
    folderId: folderDetails,
  }));

  if (movedSnippets && movedSnippets.length > 0) {
    if (destinationData && queryClient.getQueryData(foldersKey)) {
      queryClient.setQueryData(foldersKey, {
        data: [...movedSnippets, ...destinationData.data],
      });
    } else {
      if (queryClient.getQueryData(foldersKey))
        queryClient.setQueryData(foldersKey, { data: movedSnippets });
    }
  }

  // Update folder counts
  const folderCounts = previousFolderSnippets?.reduce(
    (acc, snippet: Snippet) => {
      const currFolder = snippet.folderId?._id;
      if (!currFolder) return acc;

      const existing = acc.find((item) => item.id === currFolder);
      if (existing) existing.count += 1;
      else
        acc.push({
          id: currFolder,
          name: snippet.folderId?.name,
          count: 1,
        });
      return acc;
    },
    [] as { id: string; name: string | undefined; count: number }[],
  );

  const existingCounts = folders?.data || [];
  const updatedFolders = existingCounts.map((folder) => {
    const match = folderCounts?.find((f) => f.id === folder._id);
    if (match) {
      return {
        ...folder,
        snippetCount: folder.snippetCount - match.count,
      };
    }
    return folder;
  });

  existingCounts.map((each) => {
    if (each._id === folderId)
      each.snippetCount = each.snippetCount + snippetIds.length;
  });

  if (queryClient.getQueryData(foldersQueryKey))
    queryClient.setQueryData<{ data: Folder[] }>(foldersQueryKey, {
      data: updatedFolders,
    });
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
