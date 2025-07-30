import { Alert } from "components/Alert";
import Loading from "components/Loading";
import RenderSnippet from "components/RenderSnippet";

// import SnippetDetails from "components/SnippetDetails";
// import { ROUTES } from "config/routes.config";
// import useGetSnippets from "hooks/snippets/useGetSnippets";
// import { useMemo } from "react";
import type { Snippet } from "src/types/snippet.types";

interface SnippetListType {
  type: string;
  loading: boolean;
  error: boolean;
  snippets: Snippet[];
}

const SnippetList = ({ type, loading, error, snippets }: SnippetListType) => {
  if (loading) {
    return (
      <div className="bg-card p-4 border rounded-xl w-1/3">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card p-2 border rounded-xl w-1/3">
        <Alert
          type="error"
          title="Something went wrong!"
          description="Please try again."
        />
      </div>
    );
  }

  const renderContent =
    snippets?.length > 0 ? (
      snippets?.map((snippet: Snippet) => (
        <RenderSnippet key={snippet._id} snippet={snippet} />
      ))
    ) : (
      <div className="p-2">
        <Alert
          type="info"
          title="It's so lonely here... even the semicolons left."
          description={
            type === "all"
              ? "Let's add a snippet and break the ice like a true coder."
              : "No snippets to show!"
          }
        />
      </div>
    );

  return (
    <>
      <div className="bg-card border rounded-xl w-1/3 overflow-auto text-card-foreground">
        {renderContent}
      </div>

      {/* <div className="flex-1 bg-card overflow-auto text-card-foreground">
        {showDetails && <SnippetDetails />}
      </div> */}
    </>
  );
};

export default SnippetList;
