import { lazy } from "react";
import { useParams } from "react-router";

import { Alert } from "@/components/Alert";
import ErrorBoundary from "@/components/ErrorBoundry/ErrorBoundry";
import useGetFolderSnippets from "@/hooks/snippets/useGetFolderSnippets";
// import SnippetList from "@/pages/SnippetList/SnippetList";

const SnippetList = lazy(() => import("@/pages/SnippetList/SnippetList"));

const Folder = () => {
  const { folderId } = useParams();

  const {
    isLoading,
    data: snippets = [],
    isError,
  } = useGetFolderSnippets(folderId);

  // sort snippets with updatedAt if available else createdAt
  const sorted = snippets.slice().sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt).getTime();
    return dateB - dateA;
  });

  if (!folderId) return;

  return (
    <ErrorBoundary
      fallback={<Alert type="error" title="Failed to load snippet list" />}
    >
      <SnippetList
        type="folder"
        loading={isLoading}
        error={isError}
        snippets={sorted}
      />
    </ErrorBoundary>
  );
};

export default Folder;
