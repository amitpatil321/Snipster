/* eslint-disable react-hooks/exhaustive-deps */
import { AnimatePresence, motion } from "framer-motion";
import { lazy, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import ActionButtons from "./components/ActioButtons";

import type { RootState } from "@/store";
import type { Snippet } from "@/types/snippet.types";

import { Alert } from "@/components/Alert";
import Loading from "@/components/Loading";
import RenderSnippet from "@/components/RenderSnippet";
import { ROUTES } from "@/config/routes.config";
import useBulkFavorites from "@/hooks/snippets/useBulkFavorite";
import useToggleFavorite from "@/hooks/snippets/useToggleFavorite";
import useToggleRemove from "@/hooks/snippets/useToggleRemove";

const SnippetDetails = lazy(
  () => import("@/pages/SnippetDetails/SnippetDetails"),
);

interface SnippetListType {
  type: string;
  loading: boolean;
  error: boolean;
  snippets: Snippet[];
}

const SnippetList = ({ type, loading, error, snippets }: SnippetListType) => {
  const params = useParams();
  const currentPage = useSelector((state: RootState) => state.app.currentPage);
  const [selected, setSelected] = useState<string | null | undefined>(
    params?.id,
  );
  const [selectedSnippets, setSelectedSnippets] = useState<string[]>([]);

  // if selectedSnippets has something then add more else show snippet details
  const handleSelect = useCallback(
    (snippetId: string | null | undefined) => {
      if (!snippetId) return;

      if (selectedSnippets.length > 0) {
        handleCheckboxClick(
          { stopPropagation() {}, preventDefault() {} } as React.MouseEvent,
          snippetId,
        );
      } else setSelected(snippetId);
    },
    [selectedSnippets.length],
  );

  const { mutate: toggleFavorite } = useToggleFavorite(currentPage?.path);
  const { mutate: toggleRemove } = useToggleRemove(currentPage?.path);
  const { mutate: bulkFavorite } = useBulkFavorites();

  // on page change de-select snippet ids
  useEffect(() => {
    setSelectedSnippets([]);
  }, [currentPage]);

  const handleBulkFav = () => {
    const favStatus = currentPage?.path !== `/` + ROUTES.FAVORITE;
    bulkFavorite({
      ids: selectedSnippets,
      status: favStatus,
    });
  };

  const deleteSnippet = (snippet: Snippet, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    toggleRemove(snippet);
  };

  const favoriteSnippet = (snippet: Snippet, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    toggleFavorite(snippet);
  };

  const handleCheckboxClick = (event: React.MouseEvent, snippetId: string) => {
    event?.stopPropagation();
    event?.preventDefault();
    const list = selectedSnippets.includes(snippetId)
      ? selectedSnippets.filter((each) => each !== snippetId)
      : [...selectedSnippets, snippetId];
    setSelectedSnippets(list);
  };

  if (loading) {
    return (
      <div className="bg-card p-4 border rounded-xl w-1/3">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card p-2 border rounded-xl w-1/3">
        <Alert
          type="error"
          title="Something went wrong!"
          description="Please try again."
        />
      </div>
    );
  }

  const renderContent =
    snippets?.length > 0 ? (
      <AnimatePresence initial={true}>
        {snippets?.map((snippet: Snippet) => (
          <motion.div
            key={snippet._id}
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <RenderSnippet
              key={snippet._id}
              snippet={snippet}
              selected={selected}
              setSelected={handleSelect}
              selectedSnippets={selectedSnippets}
              handleCheckboxClick={handleCheckboxClick}
              deleteSnippet={deleteSnippet}
              favoriteSnippet={favoriteSnippet}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    ) : (
      <div className="p-2">
        <Alert
          type="info"
          title="It's so lonely here... even the semicolons left."
          description={
            type === "all"
              ? "Let's add a snippet and break the ice like a true coder."
              : "No snippets to show!"
          }
        />
      </div>
    );

  return (
    <>
      <div className="bg-card shadow-lg border rounded-xl sm:w-full md:w-1/3 overflow-auto text-card-foreground">
        <ActionButtons
          snippets={snippets}
          selectedSnippets={selectedSnippets}
          setSelectedSnippets={setSelectedSnippets}
          handleBulkFav={handleBulkFav}
          currentPage={currentPage}
        />
        {renderContent}
      </div>

      <div className="hidden md:block flex-1 bg-card shadow-lg border rounded-xl overflow-auto text-card-foreground">
        {selected ? (
          <SnippetDetails setSelected={handleSelect} />
        ) : (
          <div className="m-2">
            <Alert type="info" title="Please select snippet to view details" />
          </div>
        )}
      </div>
    </>
  );
};

export default SnippetList;
