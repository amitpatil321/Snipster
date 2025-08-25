import { lazy } from "react";
import { useParams } from "react-router";

import { Alert } from "@/components/Alert";
import ErrorBoundary from "@/components/ErrorBoundry/ErrorBoundry";
import useGetSnippets from "@/hooks/snippets/useGetSnippets";
// import SnippetList from "@/pages/SnippetList/SnippetList";

const SnippetList = lazy(() => import("@/pages/SnippetList/SnippetList"));

const Folder = () => {
  const { folderId } = useParams();

  const {
    isLoading,
    data: snippets = [],
    isError,
  } = useGetSnippets("folder", folderId);

  if (!folderId) return;

  return (
    <ErrorBoundary
      fallback={<Alert type="error" title="Failed to load snippet list" />}
    >
      <SnippetList
        type="folder"
        loading={isLoading}
        error={isError}
        snippets={snippets}
      />
    </ErrorBoundary>
  );
};

export default Folder;
