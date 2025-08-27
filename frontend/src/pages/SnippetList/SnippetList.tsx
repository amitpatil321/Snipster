import { lazy, Suspense, useState } from "react";
import { useParams } from "react-router";

import ActionButtons from "./components/ActioButtons";

import type { Snippet } from "@/types/snippet.types";

import { Alert } from "@/components/Alert";
import ErrorBoundary from "@/components/ErrorBoundry/ErrorBoundry";
import Loading from "@/components/Loading";
import RenderSnippet from "@/components/RenderSnippet";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import SnippetListProvider from "@/providers/SnippetListProvider";

const SnippetDetails = lazy(
  () => import("@/pages/SnippetDetails/SnippetDetails"),
);

interface SnippetListType {
  type: string;
  loading: boolean;
  error: boolean;
  snippets: Snippet[];
}

const SnippetList = ({ type, loading, error, snippets }: SnippetListType) => {
  const params = useParams();
  const [selected, setSelected] = useState<string | null | undefined>(
    params?.id,
  );
  const isMobile = useIsMobile();

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
    snippets?.length > 0
      ? // <AnimatePresence initial={true}>
        snippets?.map((snippet: Snippet) => (
          // <motion.div
          //   key={snippet._id}
          //   initial={{ height: 0 }}
          //   animate={{ height: "auto" }}
          //   exit={{ height: 0 }}
          //   style={{ overflow: "hidden" }}
          // >
          <RenderSnippet key={snippet._id} snippet={snippet} />
          // </motion.div>
        ))
      : // </AnimatePresence>
        !loading && (
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
    <SnippetListProvider
      snippets={snippets}
      selected={selected}
      setSelected={setSelected}
    >
      <div className="bg-card shadow-lg border rounded-xl w-full md:w-1/3 overflow-auto text-card-foreground">
        <ActionButtons />
        {loading && (
          <div className="pt-4">
            <Loading />
          </div>
        )}
        {!loading && renderContent}
      </div>

      <Suspense
        fallback={
          !isMobile && (
            <div className="flex-1 bg-card shadow-lg ml-4 pt-4 border rounded-xl w-1/3 overflow-auto text-card-foreground">
              <Loading />
            </div>
          )
        }
      >
        {selected ? (
          <ErrorBoundary
            fallback={
              <div className="inline-block m-2">
                <Alert type="error" title="Failed to load snippet list" />
              </div>
            }
          >
            {!isMobile ? (
              <div className="flex-1 bg-card shadow-lg ml-4 border rounded-xl w-1/3 overflow-auto text-card-foreground">
                <SnippetDetails />
              </div>
            ) : (
              <Sheet
                open={!!selected}
                onOpenChange={(open) => !open && setSelected(null)}
              >
                <SheetHeader></SheetHeader>
                {/* <SheetContent className="w-full md:w-3/4 lg:w-2/3"> */}
                <SheetContent className="w-full md:w-3/4 lg:w-2/3">
                  <div className="flex-1 gap-6 grid auto-rows-min px-4">
                    <SnippetDetails key={selected} />
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelected(null);
                          }}
                        >
                          Close
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </ErrorBoundary>
        ) : (
          !isMobile && (
            <div className="flex-1 bg-card shadow-lg ml-4 p-2 border rounded-xl overflow-auto text-card-foreground">
              <Alert
                type="info"
                title="Please select snippet to view details"
              />
            </div>
          )
        )}
      </Suspense>
    </SnippetListProvider>
  );
};

export default SnippetList;
