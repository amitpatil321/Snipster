import { useContext } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";

import SnippetDetailsView from "./SnipeptDetails.view";

import type { SnippetListContextType } from "@/types/app.types";
import type { Snippet } from "@/types/snippet.types";

import { SnippetListContext } from "@/context/SnippetListContext";
import { useGetSnipeptDetails } from "@/hooks/snippets/useGetSnippetDetails";
import useToggleFavorite from "@/hooks/snippets/useToggleFavorite";
import useToggleRemove from "@/hooks/snippets/useToggleRemove";
import { toggleAddSnippet } from "@/store/app/appSlice";

const SnippetDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { handleSelect } = useContext(
    SnippetListContext,
  ) as SnippetListContextType;

  const {
    data: snippet,
    isLoading,
    isFetching,
    isError,
  } = useGetSnipeptDetails(id);

  const { mutate: toggleFavorite } = useToggleFavorite();
  const { mutate: toggleRemove } = useToggleRemove({
    onSuccess: () => {
      handleSelect(null);
    },
  });

  const handleToggleFavorite = (snippet: Snippet) => {
    toggleFavorite({
      ids: [snippet._id],
      status: snippet.favorite ? false : true,
    });
  };

  const handleToggleRemove = (snippet: Snippet) => {
    toggleRemove({
      ids: [snippet._id],
      status: snippet.favorite ? false : true,
    });
  };

  const updateSnippet = () => {
    dispatch(toggleAddSnippet({ state: true, data: snippet }));
  };

  return (
    <SnippetDetailsView
      toggleFavorite={handleToggleFavorite}
      toggleRemove={handleToggleRemove}
      updateSnippet={updateSnippet}
      loading={isLoading || isFetching}
      error={isError}
      snippet={snippet}
    />
  );
};

export default SnippetDetails;
