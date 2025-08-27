import { memo, useCallback, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router";

import SnippetActions from "./SnippetActions";
import { Badge } from "./ui/badge";

import type { RootState } from "@/store";
import type { SnippetListContextType } from "@/types/app.types";
import type { Snippet } from "@/types/snippet.types";

import { Checkbox } from "@/components/ui/checkbox";
import { ROUTES } from "@/config/routes.config";
import { SnippetListContext } from "@/context/SnippetListContext";
import { formatRelativeTime } from "@/lib/utils";
import { getSnippetDetailUrl } from "@/utils/url.utils";

interface RenderSnippetProps {
  snippet: Snippet;
}

const RenderSnippet = memo(({ snippet }: RenderSnippetProps) => {
  const { selected, setSelected, selectedSnippets, handleCheckboxClick } =
    useContext(SnippetListContext) as SnippetListContextType;
  // const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const { folderId: paramFolderId } = useParams();
  const currentPage = useSelector((state: RootState) => state.app.currentPage);

  const { _id, title, folderId, createdAt } = snippet;

  const detailUrl = getSnippetDetailUrl({
    base: currentPage?.type || "all",
    id: _id,
    paramFolderId,
  });

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (selectedSnippets.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        handleCheckboxClick(e, snippet._id);
      } else {
        setSelected(snippet._id);
      }
    },
    [selectedSnippets.length, handleCheckboxClick, snippet._id, setSelected],
  );

  return (
    <Link
      key={_id}
      className={`${selected === snippet._id ? "bg-muted" : ""} group flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-accent hover:text-accent-foreground`}
      to={`${detailUrl}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center">
        {/* <AnimatePresence> */}
        {(currentPage!.type === ROUTES.ALL ||
          [ROUTES.FAVORITE, ROUTES.TRASH, ROUTES.FOLDER].includes(
            // disable checkbox for folders
            currentPage!.type,
          )) &&
          (selectedSnippets.length > 0 || isHovered) && (
            // <motion.div
            //   key={_id}
            //   initial={{ opacity: 0, x: -5 }}
            //   animate={{ opacity: 1, x: 0 }}
            //   // exit={{ opacity: 0, x: -10 }}
            //   transition={{ duration: 0.2 }}
            //   className="left-0 relative mr-1"
            // >
            <div
              className={`transition-all mr-1 translate-x-[0px] duration-100 checkbox-wrapper ${
                selectedSnippets.length > 0
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
              }`}
            >
              <Checkbox
                onClick={(event) => handleCheckboxClick(event, _id)}
                checked={selectedSnippets.includes(_id)}
                aria-label={`Select snippet with ID ${_id}`}
              />
            </div>
            // </motion.div>
          )}

        {/* <motion.h3
            initial={{ opacity: 1, x: 0 }}
            animate={{
              x: isHovered ? 3 : 0,
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="font-medium text-base line-clamp-1 basis-[90%]"
          > */}
        <h3 className="font-medium text-base line-clamp-1 transition-transform group-hover:translate-x-[3px] duration-100 basis-[90%]">
          {title}
        </h3>
        {/* </motion.h3> */}
        {/* </AnimatePresence> */}
        <SnippetActions
          snippet={snippet}
          currentPageType={currentPage?.type || "all"}
        />
        {/* <div
          className={`${!snippet?.deletedAt && "flex justify-end flex-row gap-2 basis-[10%]"}`}
        >
          {snippet?.deletedAt ? (
            <Undo
              className="opacity-0 group-hover:opacity-100 w-4 h-4 text-gray-400 hover:text-red-500 transition-all duration-400"
              onClick={(event) => deleteSnippet(snippet, event)}
            />
          ) : currentPage?.type !== "folder" ? (
            <Trash2
              className={`opacity-0 group-hover:opacity-100 w-4 h-4 text-gray-400 hover:text-red-500 transition-all duration-400`}
              onClick={(event) => deleteSnippet(snippet, event)}
            />
          ) : (
            ""
          )}
          {!snippet?.deletedAt && (
            <Star
              className={`opacity-0 group-hover:opacity-100 ${currentPage?.type !== "folder" ? "cursor-pointer" : "cursor-not-allowed"} w-4 h-4 text-gray-400 transition-all duration-400 ease-in-out
    ${favorite ? "opacity-100 text-yellow-500 fill-yellow-500" : `hover:${currentPage?.type !== "folder" && "text-yellow-500 hover:fill-yellow-500"}`}`}
              onClick={(event) =>
                currentPage?.type !== "folder" &&
                favoriteSnippet(snippet, event)
              }
            />
          )}
        </div> */}
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
          <span></span>
        )}
        <div className="flex flex-row gap-4 opacity-60 text-muted-foreground text-xs">
          <span>{createdAt && formatRelativeTime(createdAt)}</span>
        </div>
      </div>
    </Link>
  );
});

export default RenderSnippet;
