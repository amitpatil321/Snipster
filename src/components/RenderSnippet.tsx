import { ROUTES } from "config/routes.config";
import useToggleFavorite from "hooks/snippets/useToggleFavorite";
import { formatRelativeTime } from "lib/utils";
import { Star, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router";

import { Badge } from "./ui/badge";

import type { RootState } from "store/index";
import type { Snippet } from "types/snippet.types";

const RenderSnippet = ({ snippet }: { snippet: Snippet }) => {
  const location = useLocation();
  const basePath = location.pathname.split("/")[1];
  const { _id, title, favorite, folderId, createdAt } = snippet;
  const currentPage = useSelector((state: RootState) => state.app.currentPage);

  const { mutate: toggleFavorite } = useToggleFavorite(
    snippet,
    currentPage?.path,
  );

  const deleteSnippet = () => {
    console.log("delete");
  };

  const favoriteSnippet = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    toggleFavorite();
  };

  return (
    <Link
      key={_id}
      className="group flex flex-col gap-1 hover:bg-accent/50 px-4 py-3 transition-colors"
      to={`/${basePath}/${ROUTES.DETAILS}/${_id}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-base truncate basis-[90%]">{title}</h3>
        <div className="flex flex-row gap-3 basis-[10%]">
          <Trash2
            className="opacity-0 group-hover:opacity-100 w-4 h-4 text-gray-400 hover:text-red-500 transition-all duration-400"
            onClick={deleteSnippet}
          />
          {favorite ? (
            <Star
              className="fill-yellow-500 w-4 h-4 text-yellow-500"
              onClick={(event) => favoriteSnippet(event)}
            />
          ) : (
            <Star
              className="opacity-0 group-hover:opacity-100 hover:fill-yellow-500 w-4 h-4 text-gray-400 hover:text-yellow-500 transition-all duration-400"
              onClick={(event) => favoriteSnippet(event)}
            />
          )}
        </div>
      </div>

      <div className="flex flex-row flex-wrap justify-between gap-1">
        {folderId ? (
          <Badge
            key={folderId?._id}
            variant="secondary"
            className="opacity-80 text-xs"
          >
            {folderId?.name}
          </Badge>
        ) : (
          <>&nbsp;</>
        )}
        <div className="flex flex-row gap-4 opacity-60 text-muted-foreground text-xs">
          <span>{createdAt && formatRelativeTime(createdAt)}</span>
        </div>
      </div>
    </Link>
  );
};

export default RenderSnippet;
