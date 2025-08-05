import useToggleFavorite from "hooks/snippets/useToggleFavorite";
import useToggleRemove from "hooks/snippets/useToggleRemove";
import { formatRelativeTime } from "lib/utils";
import { Star, Trash2 } from "lucide-react";
import { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router";
import { getSnippetDetailUrl } from "utils/url.utils";

import { Badge } from "./ui/badge";

import type { RootState } from "store/index";
import type { Snippet } from "types/snippet.types";

const RenderSnippet = memo(
  ({
    snippet,
    selected,
    setSelected,
  }: {
    snippet: Snippet;
    selected: string | undefined | null;
    setSelected: (snippet: string | null | undefined) => void;
  }) => {
    const location = useLocation();
    const { folderId: paramFolderId } = useParams();
    const basePath = useMemo(() => location.pathname.split("/")[1], [location]);
    const { _id, title, favorite, folderId, createdAt } = snippet;
    const currentPage = useSelector(
      (state: RootState) => state.app.currentPage,
    );
    const detailUrl = getSnippetDetailUrl({
      base: basePath,
      id: _id,
      paramFolderId,
    });
    const { mutate: toggleFavorite } = useToggleFavorite(
      snippet,
      currentPage?.path,
    );
    const { mutate: toggleRemove } = useToggleRemove(
      snippet,
      currentPage?.path,
    );

    const deleteSnippet = (event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      toggleRemove();
    };

    const favoriteSnippet = (event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      toggleFavorite();
    };

    return (
      <Link
        key={_id}
        className={`${selected === snippet._id ? "bg-muted" : ""} group flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-accent hover:text-accent-foreground`}
        to={`${detailUrl}`}
        onClick={() => setSelected(snippet?._id)}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-base truncate basis-[90%]">
            {title}
          </h3>
          <div className="flex flex-row gap-3 basis-[10%]">
            <Trash2
              className="opacity-0 group-hover:opacity-100 w-4 h-4 text-gray-400 hover:text-red-500 transition-all duration-400"
              onClick={(event) => deleteSnippet(event)}
            />
            <Star
              className={`opacity-0 group-hover:opacity-100 cursor-pointer w-4 h-4 text-gray-400 transition-all duration-400 ease-in-out
    ${favorite ? "opacity-100 text-yellow-500 fill-yellow-500" : "hover:text-yellow-500 hover:fill-yellow-500"}`}
              onClick={(event) => favoriteSnippet(event)}
            />
          </div>
        </div>

        <div className="flex flex-row flex-wrap justify-between gap-1">
          {folderId && (
            <Badge
              key={folderId?._id}
              variant="secondary"
              className="opacity-80 text-xs"
            >
              {folderId?.name}
            </Badge>
          )}
          <div className="flex flex-row gap-4 opacity-60 text-muted-foreground text-xs">
            <span>{createdAt && formatRelativeTime(createdAt)}</span>
          </div>
        </div>
      </Link>
    );
  },
);

export default RenderSnippet;
