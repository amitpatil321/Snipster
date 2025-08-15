import { useLocation } from "react-router";

import SnippetList from "../SnippetList/SnippetList";

import useGetSnippets from "@/hooks/snippets/useGetSnippets";

const Platform = () => {
  const params = useLocation();
  const type = params.pathname.split("/")?.[1]; //todo: replace this with redux state currentPage

  const {
    isLoading,
    isFetching,
    data: snippets = [],
    isError,
  } = useGetSnippets(type);

  return (
    <SnippetList
      type="folder"
      loading={isLoading || isFetching}
      error={isError}
      snippets={snippets}
    />
  );
};

export default Platform;
