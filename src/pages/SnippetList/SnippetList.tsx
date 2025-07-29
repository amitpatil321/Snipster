import { Alert } from "components/Alert";
import Loading from "components/Loading";
import RenderSnippet from "components/RenderSnippet";
import SnippetDetails from "components/SnippetDetails";
import { ROUTES } from "config/routes.config";
import useGetSnippets from "hooks/snippets/useGetSnippets";

const SnippetList = () => {
  const type = (() => {
    if (location.pathname.includes("favorite")) return "favorite";
    if (location.pathname.includes("trash")) return "trash";
    return "all";
  })();

  const showDetails = location.pathname.includes(ROUTES.DETAILS);

  const {
    isLoading,
    data: snippets = [],
    isError = true,
  } = useGetSnippets(type);

  const NoData = () => (
    <div className="p-2">
      <Alert
        type="info"
        title="It's so lonely here...even the semicolons left."
        description={
          type === "all"
            ? "Lets add a snippet and break the ice like a true coder"
            : "No snippets to show!"
        }
      />
    </div>
  );

  return (
    <>
      <div className="bg-card border rounded-xl w-1/3 overflow-auto text-card-foreground">
        {isLoading && <Loading className="mt-4" />}
        {!isLoading && isError && (
          <div className="p-2">
            <Alert
              type="error"
              title="Something went wrong! Please try again"
            />
          </div>
        )}
        {!isLoading && !isError && (snippets?.length ?? 0) <= 0 ? (
          <NoData />
        ) : (
          snippets?.map((snippet) => <RenderSnippet snippet={snippet} />)
        )}
      </div>
      <div className="flex-1 bg-card overflow-auto text-card-foreground">
        {showDetails && <SnippetDetails />}
      </div>
      {/* <div className="flex-1 bg-card p-4 border rounded-lg overflow-auto text-card-foreground">
        {showDetails && <SnippetDetails />}
      </div> */}
    </>
  );
};

export default SnippetList;
