import { useLocation } from "react-router";

import { Alert } from "@/components/Alert";
import ErrorBoundary from "@/components/ErrorBoundry/ErrorBoundry";
import useGetSnippets from "@/hooks/snippets/useGetSnippets";
import SnippetList from "@/pages/SnippetList/SnippetList";
// const SnippetList = lazy(() => import("@/pages/SnippetList/SnippetList"));

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
      <SnippetList
        type="folder"
        loading={isLoading || isFetching}
        error={isError}
        snippets={snippets}
      />
      {/* <Suspense
        fallback={
          <div className="w-full">
            <Loading />
          </div>
        }
      >
        <SnippetList
          type="folder"
          loading={isLoading || isFetching}
          error={isError}
          snippets={snippets}
        />
      </Suspense> */}
    </ErrorBoundary>
  );
};

export default Platform;
