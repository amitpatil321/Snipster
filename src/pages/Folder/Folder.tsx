import useGetSnippets from "hooks/snippets/useGetSnippets";
import SnippetList from "pages/SnippetList/SnippetList";
import { useParams } from "react-router";

const Folder = () => {
  const { folderId } = useParams();

  const {
    isLoading,
    data: snippets = [],
    isError,
  } = useGetSnippets("folder", folderId);

  if (!folderId) return;

  return (
    <SnippetList
      type="folder"
      loading={isLoading}
      error={isError}
      snippets={snippets}
    />
  );
};

export default Folder;
