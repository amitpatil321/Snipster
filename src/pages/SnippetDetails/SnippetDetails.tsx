import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import SnippetDetailsView from "./SnipeptDetails.view";

import type { RootState } from "@/store/index";

import { useGetSnipeptDetails } from "@/hooks/snippets/useGetSnippetDetails";
import useToggleFavorite from "@/hooks/snippets/useToggleFavorite";
import useToggleRemove from "@/hooks/snippets/useToggleRemove";
import { toggleAddSnippet } from "@/store/app/appSlice";

const SnippetDetails = ({
  setSelected,
}: {
  setSelected: (snippet: string | undefined | null) => void;
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    data: snippet,
    isLoading,
    isFetching,
    isError,
  } = useGetSnipeptDetails(id);
  const currentPage = useSelector((state: RootState) => state.app.currentPage);

  const { mutate: toggleFavorite } = useToggleFavorite(
    snippet,
    currentPage?.path,
    null,
  );
  const { mutate: toggleRemove } = useToggleRemove(
    snippet,
    currentPage?.path,
    null,
    {
      onSuccess: () => {
        setSelected(null);
      },
    },
  );

  const updateSnippet = () => {
    dispatch(toggleAddSnippet({ state: true, data: snippet }));
  };

  return (
    <SnippetDetailsView
      toggleFavorite={toggleFavorite}
      toggleRemove={toggleRemove}
      updateSnippet={updateSnippet}
      loading={isLoading || isFetching}
      error={isError}
      snippet={snippet}
    />
  );
};

export default SnippetDetails;
