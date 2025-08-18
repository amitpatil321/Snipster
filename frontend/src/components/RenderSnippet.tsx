import { AnimatePresence, motion } from "framer-motion";
import { Star, Trash2, Undo } from "lucide-react";
import { memo, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router";

import { Badge } from "./ui/badge";

import type { RootState } from "@/store";
import type { SnippetListContextType } from "@/types/app.types";
import type { Snippet } from "@/types/snippet.types";

import { Checkbox } from "@/components/ui/checkbox";
import { SnippetListContext } from "@/contexts/SnippetListContext";
import { formatRelativeTime } from "@/lib/utils";
import { getSnippetDetailUrl } from "@/utils/url.utils";

interface RenderSnippetProps {
  snippet: Snippet;
}

const RenderSnippet = memo(({ snippet }: RenderSnippetProps) => {
  const {
    selected,
    setSelected,
    selectedSnippets,
    handleCheckboxClick,
    favoriteSnippet,
    deleteSnippet,
  } = useContext(SnippetListContext) as SnippetListContextType;
  // const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const { folderId: paramFolderId } = useParams();
  const currentPage = useSelector((state: RootState) => state.app.currentPage);

  const { _id, title, favorite, folderId, createdAt } = snippet;

  const detailUrl = getSnippetDetailUrl({
    base: currentPage?.type || "all",
    id: _id,
    paramFolderId,
  });

  return (
    <Link
      key={_id}
      className={`${selected === snippet._id ? "bg-muted" : ""} group flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-accent hover:text-accent-foreground`}
      to={`${detailUrl}`}
      onClick={(e) => {
        // if we are in snippet selection mode then dont change url, rest is handled in controller "handleCheckboxClick" method
        if (selectedSnippets.length > 0) {
          e.preventDefault();
          e.stopPropagation();
          handleCheckboxClick(e, snippet._id);
        } else {
          setSelected(snippet._id);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center">
        <AnimatePresence>
          {((currentPage!.type === "all" && !snippet.favorite) ||
            ["favorite", "trash"].includes(currentPage!.type)) &&
            (selectedSnippets.length > 0 || isHovered) && (
              <motion.div
                key={_id}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                // exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="left-0 relative mr-1"
              >
                <Checkbox
                  onClick={(event) => handleCheckboxClick(event, _id)}
                  checked={selectedSnippets.includes(_id)}
                />
              </motion.div>
            )}

          <motion.h3
            initial={{ opacity: 1, x: 0 }}
            animate={{
              x: isHovered ? 3 : 0,
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="font-medium text-base truncate basis-[90%]"
          >
            {title}
          </motion.h3>
        </AnimatePresence>
        <div
          className={`${!snippet?.deletedAt && "flex flex-row gap-2 basis-[10%]"}`}
        >
          {snippet?.deletedAt ? (
            <Undo
              className="opacity-0 group-hover:opacity-100 w-4 h-4 text-gray-400 hover:text-red-500 transition-all duration-400"
              onClick={(event) => deleteSnippet(snippet, event)}
            />
          ) : (
            <Trash2
              className="opacity-0 group-hover:opacity-100 w-4 h-4 text-gray-400 hover:text-red-500 transition-all duration-400"
              onClick={(event) => deleteSnippet(snippet, event)}
            />
          )}
          {!snippet?.deletedAt && (
            <Star
              className={`opacity-0 group-hover:opacity-100 cursor-pointer w-4 h-4 text-gray-400 transition-all duration-400 ease-in-out
    ${favorite ? "opacity-100 text-yellow-500 fill-yellow-500" : "hover:text-yellow-500 hover:fill-yellow-500"}`}
              onClick={(event) => favoriteSnippet(snippet, event)}
            />
          )}
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
});

export default RenderSnippet;
