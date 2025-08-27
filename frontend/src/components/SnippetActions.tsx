import { Star, Trash2, Undo } from "lucide-react";
import { memo, useContext } from "react";

import type { SnippetListContextType } from "@/types/app.types";
import type { Snippet } from "@/types/snippet.types";

import { SnippetListContext } from "@/context/SnippetListContext";

interface SnippetActionsProps {
  snippet: Snippet;
  currentPageType: string;
}

const SnippetActions = memo(
  ({ snippet, currentPageType }: SnippetActionsProps) => {
    const { favoriteSnippet, deleteSnippet } = useContext(
      SnippetListContext,
    ) as SnippetListContextType;

    return (
      <div
        className={`${!snippet.deletedAt && "flex justify-end flex-row gap-2 basis-[10%]"}`}
      >
        {snippet.deletedAt ? (
          <Undo
            className="opacity-0 group-hover:opacity-100 w-4 h-4 text-gray-400 hover:text-red-500 transition-all duration-400"
            onClick={(event) => deleteSnippet(snippet, event)}
          />
        ) : currentPageType !== "folder" ? (
          <Trash2
            className="opacity-0 group-hover:opacity-100 w-4 h-4 text-gray-400 hover:text-red-500 transition-all duration-400"
            onClick={(event) => deleteSnippet(snippet, event)}
          />
        ) : null}

        {!snippet.deletedAt && (
          <Star
            className={`opacity-0 group-hover:opacity-100 ${
              currentPageType !== "folder"
                ? "cursor-pointer"
                : "cursor-not-allowed"
            } w-4 h-4 text-gray-400 transition-all duration-400 ease-in-out
          ${snippet.favorite ? "opacity-100 text-yellow-500 fill-yellow-500" : ""}`}
            onClick={(event) =>
              currentPageType !== "folder" && favoriteSnippet(snippet, event)
            }
          />
        )}
      </div>
    );
  },
);

export default SnippetActions;
