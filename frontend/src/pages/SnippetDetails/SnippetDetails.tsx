import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import SnippetDetailsView from "./SnipeptDetails.view";

import type { RootState } from "@/store";
import type { SnippetListContextType } from "@/types/app.types";
import type { Snippet } from "@/types/snippet.types";

import { SnippetListContext } from "@/context/SnippetListContext";
import { useGetSnipeptDetails } from "@/hooks/snippets/useGetSnippetDetails";
import useToggleFavorite from "@/hooks/snippets/useToggleFavorite";
import useToggleRemove from "@/hooks/snippets/useToggleRemove";
import { setSnippetDetails, toggleAddSnippet } from "@/store/app/appSlice";

const SnippetDetails = () => {
  const dispatch = useDispatch();
  const { handleSelect } = useContext(
    SnippetListContext,
  ) as SnippetListContextType;
  const snippetDetails = useSelector(
    (state: RootState) => state.app.snippetDetails,
  );
  const {
    data: snippet,
    isLoading,
    isFetching,
    isError,
  } = useGetSnipeptDetails(snippetDetails?._id);

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

  useEffect(() => {
    if (snippet?.content) dispatch(setSnippetDetails({ ...snippet }));
  }, [snippet, dispatch]);

  return (
    <SnippetDetailsView
      toggleFavorite={handleToggleFavorite}
      toggleRemove={handleToggleRemove}
      updateSnippet={updateSnippet}
      loading={isLoading || isFetching}
      error={isError}
    />
  );
};

export default SnippetDetails;
