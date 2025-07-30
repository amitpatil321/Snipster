import useGetSnippets from "hooks/snippets/useGetSnippets";
import { useLocation } from "react-router";

import SnippetList from "../SnippetList/SnippetList";

const Platform = () => {
  const params = useLocation();
  const type = params.pathname.split("/")?.[1];

  const { isLoading, data: snippets = [], isError } = useGetSnippets(type);

  return (
    <SnippetList
      type="folder"
      loading={isLoading}
      error={isError}
      snippets={snippets}
    />
  );
};

export default Platform;
