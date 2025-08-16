import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "@/store";
import type { Snippet } from "@/types/snippet.types";

import { ROUTES } from "@/config/routes.config";
import { SnippetListContext } from "@/contexts/SnippetListContext";
import useBulkFavorites from "@/hooks/snippets/useBulkFavorite";
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

  const { mutate: toggleFavorite } = useToggleFavorite(currentPage?.type);
  const { mutate: toggleRemove } = useToggleRemove(currentPage?.type);
  const { mutate: bulkFavorite } = useBulkFavorites(
    currentPage?.type,
    setSelectedSnippets,
  );

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

  const handleBulkFav = useCallback(() => {
    const favStatus = currentPage?.path !== `/` + ROUTES.FAVORITE;
    bulkFavorite({ ids: selectedSnippets, status: favStatus });
  }, [bulkFavorite, currentPage?.path, selectedSnippets]);

  const deleteSnippet = useCallback(
    (snippet: Snippet, event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      toggleRemove(snippet);
    },
    [toggleRemove],
  );

  const favoriteSnippet = useCallback(
    (snippet: Snippet, event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      toggleFavorite(snippet);
    },
    [toggleFavorite],
  );

  useEffect(() => {
    setSelectedSnippets([]);
  }, [currentPage]);

  const contextValue = useMemo(
    () => ({
      snippets,
      selectedSnippets,
      setSelectedSnippets,
      handleBulkFav,
      currentPage,
      selected,
      handleSelect,
      setSelected,
      handleCheckboxClick,
      favoriteSnippet,
      deleteSnippet,
    }),
    [
      snippets,
      selectedSnippets,
      handleBulkFav,
      currentPage,
      selected,
      handleSelect,
      setSelected,
      handleCheckboxClick,
      favoriteSnippet,
      deleteSnippet,
    ],
  );

  return (
    <SnippetListContext.Provider value={contextValue}>
      {children}
    </SnippetListContext.Provider>
  );
};

export default SnippetListProvider;
