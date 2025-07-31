import { useGetSnipeptDetails } from "hooks/snippets/useGetSnippetDetails";
import useToggleFavorite from "hooks/snippets/useToggleFavorite";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import SnippetDetailsView from "./SnipeptDetails.view";

import type { RootState } from "src/store";

const SnippetDetails = () => {
  const { id } = useParams();
  const { data: snippet, isLoading, isError } = useGetSnipeptDetails(id);
  const currentPage = useSelector((state: RootState) => state.app.currentPage);

  const { mutate: toggleFavorite } = useToggleFavorite(
    snippet,
    currentPage?.path,
    null,
  );

  return (
    <SnippetDetailsView
      toggleFavorite={toggleFavorite}
      loading={isLoading}
      error={isError}
      snippet={snippet}
    />
  );
};

export default SnippetDetails;
