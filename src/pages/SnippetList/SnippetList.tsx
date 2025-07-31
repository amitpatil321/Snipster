import { Alert } from "components/Alert";
import Loading from "components/Loading";
import RenderSnippet from "components/RenderSnippet";
import SnippetDetails from "pages/SnippetDetails/SnippetDetails";
import { useCallback, useState } from "react";

import type { Snippet } from "types/snippet.types";

interface SnippetListType {
  type: string;
  loading: boolean;
  error: boolean;
  snippets: Snippet[];
}

const SnippetList = ({ type, loading, error, snippets }: SnippetListType) => {
  const [selected, setSelected] = useState<Snippet | null>(null);

  const handleSelect = useCallback((snippet: Snippet) => {
    setSelected(snippet);
  }, []);

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
        <RenderSnippet
          key={snippet._id}
          snippet={snippet}
          selected={selected}
          setSelected={handleSelect}
        />
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
      <div className="bg-card shadow-lg border rounded-xl sm:w-full md:w-1/3 overflow-auto text-card-foreground">
        {renderContent}
      </div>

      <div className="hidden md:block flex-1 bg-card shadow-lg border rounded-xl overflow-auto text-card-foreground">
        {selected && <SnippetDetails />}
      </div>
    </>
  );
};

export default SnippetList;
