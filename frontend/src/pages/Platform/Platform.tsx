import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router";

import type { RootState } from "@/store";

import { Alert } from "@/components/Alert";
import ErrorBoundary from "@/components/ErrorBoundry/ErrorBoundry";
import Loading from "@/components/Loading";
import { CONFIG } from "@/config/config";
import { useFilteredSnippets } from "@/hooks/snippets/useFilterSnippet";
import useGetSnippets from "@/hooks/snippets/useGetSnippets";
// import SnippetList from "@/pages/SnippetList/SnippetList";
const SnippetList = lazy(() => import("@/pages/SnippetList/SnippetList"));

const Platform = () => {
  const currentPage = useSelector((state: RootState) => state.app.currentPage);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get(CONFIG.SEARCH_PARAM) || "";

  const {
    isLoading,
    isFetching,
    data: snippets = [],
    isError,
  } = useGetSnippets(currentPage?.type);

  const filteredSnippets = useFilteredSnippets(snippets, searchQuery);

  return (
    <ErrorBoundary
      fallback={<Alert type="error" title="Failed to load snippet list" />}
    >
      {/* <SnippetList
        type="folder"
        loading={isLoading || isFetching}
        error={isError}
        snippets={filteredSnippets}
      /> */}
      <Suspense
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
          snippets={filteredSnippets}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Platform;
