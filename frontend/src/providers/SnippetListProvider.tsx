import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "@/store";
import type { Snippet } from "@/types/snippet.types";

import { ROUTES } from "@/config/routes.config";
import { SnippetListContext } from "@/context/SnippetListContext";
import useMoveToFolder from "@/hooks/snippets/useMoveToFolder";
import useToggleFavorite from "@/hooks/snippets/useToggleFavorite";
import useToggleRemove from "@/hooks/snippets/useToggleRemove";

const SnippetListProvider: React.FC<{
  children: React.ReactNode;
  snippets: Snippet[];
  selected: string | null | undefined;
  setSelected: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}> = ({ children, snippets, setSelected, selected }) => {
  const [selectedSnippets, setSelectedSnippets] = useState<string[]>([]);
  const currentPage = useSelector((state: RootState) => state.app.currentPage);
  const queryClient = useQueryClient();

  const { mutate: toggleFavorite } = useToggleFavorite(setSelectedSnippets);
  const { mutate: toggleRemove } = useToggleRemove(currentPage?.type);
  const { mutate: assignFolder } = useMoveToFolder(currentPage?.type, {
    onSuccess: () => {
      setSelectedSnippets([]);
    },
  });

  const handleCheckboxClick = useCallback(
    (event: React.MouseEvent, snippetId: string) => {
      event?.stopPropagation();
      event?.preventDefault();
      setSelectedSnippets((prev) =>
        prev.includes(snippetId)
          ? prev.filter((each) => each !== snippetId)
          : [...prev, snippetId],
      );
    },
    [],
  );

  const handleSelect = useCallback(
    (snippetId: string | null | undefined) => {
      if (!snippetId) return;
      if (selectedSnippets.length > 0) {
        handleCheckboxClick(
          { stopPropagation() {}, preventDefault() {} } as React.MouseEvent,
          snippetId,
        );
      } else {
        setSelected(snippetId);
      }
    },
    [selectedSnippets.length, handleCheckboxClick, setSelected],
  );

  const favoriteSnippet = useCallback(
    (snippet: Snippet, event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      toggleFavorite({ ids: [snippet._id], status: !snippet.favorite });
    },
    [toggleFavorite],
  );

  const handleBulkFav = useCallback(() => {
    const favStatus = currentPage?.path !== `/` + ROUTES.FAVORITE;
    // find distinct list which needs to be processed,
    // if user is trying to fav items which are alredy fav then ignore it.
    const currentList = queryClient.getQueryData<{ data: Snippet[] }>([
      "getSnippets",
      currentPage?.type,
    ])?.data;
    const currentFav = currentList
      ?.filter((each) => each.favorite === favStatus) // this handles fav and unfav both based on status
      .map((each) => each._id);

    const newIds = selectedSnippets.filter(
      (each) => !currentFav?.includes(each),
    );
    if (newIds.length) toggleFavorite({ ids: newIds, status: favStatus });
  }, [
    toggleFavorite,
    currentPage?.path,
    selectedSnippets,
    queryClient,
    currentPage?.type,
  ]);

  const deleteSnippet = useCallback(
    (snippet: Snippet, event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      toggleRemove({ ids: [snippet?._id], status: !snippet.deletedAt });
    },
    [toggleRemove],
  );

  const handleBulkDelete = useCallback(() => {
    const delStatus = currentPage?.path !== `/` + ROUTES.TRASH;
    toggleRemove({ ids: selectedSnippets, status: delStatus });
  }, [toggleRemove, currentPage?.path, selectedSnippets]);

  useEffect(() => {
    setSelectedSnippets([]);
  }, [currentPage]);

  const moveToFolder = useCallback(
    (snippetIds: string[], folderId: string) => {
      assignFolder({ snippetIds, folderId });
    },
    [assignFolder],
  );

  const contextValue = useMemo(
    () => ({
      snippets,
      selectedSnippets,
      setSelectedSnippets,
      handleBulkFav,
      handleBulkDelete,
      currentPage,
      selected,
      handleSelect,
      setSelected,
      handleCheckboxClick,
      favoriteSnippet,
      deleteSnippet,
      moveToFolder,
    }),
    [
      snippets,
      selectedSnippets,
      handleBulkFav,
      handleBulkDelete,
      currentPage,
      selected,
      handleSelect,
      setSelected,
      handleCheckboxClick,
      favoriteSnippet,
      deleteSnippet,
      moveToFolder,
    ],
  );

  return (
    <SnippetListContext.Provider value={contextValue}>
      {children}
    </SnippetListContext.Provider>
  );
};

export default SnippetListProvider;
