import { lazy, Suspense } from "react";
import { useLocation } from "react-router";

import { Alert } from "@/components/Alert";
import ErrorBoundary from "@/components/ErrorCoundry/ErrorBoundry";
import Loading from "@/components/Loading";
import useGetSnippets from "@/hooks/snippets/useGetSnippets";

const SnippetList = lazy(() => import("@/pages/SnippetList/SnippetList"));

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
    <ErrorBoundary
      fallback={<Alert type="error" title="Failed to load snippet list" />}
    >
      <Suspense fallback={<Loading />}>
        <SnippetList
          type="folder"
          loading={isLoading || isFetching}
          error={isError}
          snippets={snippets}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Platform;
