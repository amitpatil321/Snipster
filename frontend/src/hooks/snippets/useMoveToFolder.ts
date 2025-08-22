import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import type { Folder } from "@/types/folder.types";
import type { Snippet } from "@/types/snippet.types";
import type { AxiosError } from "axios";

import { moveToFolder } from "@/services/snippet.service";
import { updateSnippetProperty } from "@/utils/queryCache.utils";

const useMoveToFolder = (type: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      snippetIds,
      folderId,
    }: {
      snippetIds: string[];
      folderId: string;
    }) => moveToFolder({ snippetIds, folderId }),
    onMutate: async (payload) => {
      const { snippetIds, folderId } = payload;
      const listQueryKey = ["getSnippets", "all", null];
      const favQueryKey = ["getSnippets", "favorite", null];
      const foldersKey = ["getSnippets", "folder", folderId];

      const allKeys = [listQueryKey, favQueryKey, foldersKey];

      const foldersQueryKey = ["getFolders"];

      const allSnippets = queryClient.getQueryData<{ data: Snippet[] }>(
        listQueryKey,
      );
      const favorite = queryClient.getQueryData<{ data: Snippet[] }>(
        favQueryKey,
      );
      const folders = queryClient.getQueryData<{ data: Folder[] }>(
        foldersQueryKey,
      );

      const previousData = {
        list: { ...allSnippets },
        favorite: { ...favorite },
        folders: { ...folders },
      };

      // Cancel queries before mutation
      await Promise.all([
        ...allKeys.map((key) => queryClient.cancelQueries({ queryKey: key })),
        queryClient.cancelQueries({ queryKey: foldersQueryKey }),
      ]);

      if (type && ["all", "favorite", "folder"].includes(type)) {
        const folder = folders?.data?.find((each) => each._id === folderId);

        // Update snippet folder in all snippet lists
        allKeys.forEach((key) => {
          updateSnippetProperty(queryClient, key, snippetIds, {
            folderId: folder,
          });
        });

        // Calculate previous folder counts and which snippets are moving
        let previousFolderSnippets = allSnippets?.data?.filter((each) =>
          snippetIds.includes(each._id),
        );
        previousFolderSnippets = previousFolderSnippets?.filter(
          (each) => each.folderId?._id !== folderId,
        );

        // Remove snippets from their source folder caches
        previousFolderSnippets?.forEach((snippet) => {
          const sourceFolderId = snippet.folderId?._id;
          if (!sourceFolderId) return;

          const sourceKey = ["getSnippets", "folder", sourceFolderId];
          const sourceData = queryClient.getQueryData<{ data: Snippet[] }>(
            sourceKey,
          );

          if (sourceData) {
            if (queryClient.getQueryData(sourceKey))
              queryClient.setQueryData(sourceKey, {
                data: sourceData.data.filter(
                  (s) => !snippetIds.includes(s._id),
                ),
              });
          }
        });

        // Add snippets to destination folder cache
        const destinationData = queryClient.getQueryData<{ data: Snippet[] }>(
          foldersKey,
        );

        const movedSnippets = previousFolderSnippets?.map((snippet) => ({
          ...snippet,
          folderId: folder,
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
      }

      return { previousData };
    },
    onError: (_err, _payload, context) => {
      const listQueryKey = ["getSnippets", "all", null];
      const favQueryKey = ["getSnippets", "favorite", null];
      const foldersKey = ["getSnippets", "folder", _payload.folderId];

      const err = _err as AxiosError<{ message?: string }>;

      toast.error(
        err?.response?.data?.message ||
          "Failed to move snippets. Please try again.",
      );

      if (context?.previousData) {
        queryClient.setQueryData(listQueryKey, context.previousData.list);
        queryClient.setQueryData(favQueryKey, context.previousData.favorite);
        // queryClient.setQueryData(foldersQueryKey, context.previousData.counts);
        queryClient.setQueryData(foldersKey, context.previousData.folders);
      }
    },
    // onSettled: () => queryClient.refetchQueries({ queryKey: ["getFolders"] }),
  });
};

export default useMoveToFolder;
