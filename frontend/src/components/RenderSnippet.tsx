import { AnimatePresence, motion } from "framer-motion";
import { Star, Trash2 } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router";

import { Badge } from "./ui/badge";

import type { Snippet } from "@/types/snippet.types";

import { Checkbox } from "@/components/ui/checkbox";
import { formatRelativeTime } from "@/lib/utils";
import { getSnippetDetailUrl } from "@/utils/url.utils";

interface RenderSnippetType {
  snippet: Snippet;
  selected: string | undefined | null;
  setSelected: (snippet: string | null | undefined) => void;
  selectedSnippets: string[];
  handleCheckboxClick: (event: React.MouseEvent, id: string) => void;
  deleteSnippet: (snippet: Snippet, event: React.MouseEvent) => void;
  favoriteSnippet: (snippet: Snippet, event: React.MouseEvent) => void;
}

const RenderSnippet = memo(
  ({
    snippet,
    selected,
    setSelected,
    selectedSnippets,
    handleCheckboxClick,
    favoriteSnippet,
    deleteSnippet,
  }: RenderSnippetType) => {
    const location = useLocation();
    const [isHovered, setIsHovered] = useState(false);
    const { folderId: paramFolderId } = useParams();
    const basePath = useMemo(() => location.pathname.split("/")[1], [location]);
    const { _id, title, favorite, folderId, createdAt } = snippet;

    const detailUrl = getSnippetDetailUrl({
      base: basePath,
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
            {(selectedSnippets.length > 0 || isHovered) && (
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
          </AnimatePresence>
          <h3 className="font-medium text-base truncate basis-[90%]">
            {title}
          </h3>
          <div className="flex flex-row gap-3 basis-[10%]">
            <Trash2
              className="opacity-0 group-hover:opacity-100 w-4 h-4 text-gray-400 hover:text-red-500 transition-all duration-400"
              onClick={(event) => deleteSnippet(snippet, event)}
            />
            <Star
              className={`opacity-0 group-hover:opacity-100 cursor-pointer w-4 h-4 text-gray-400 transition-all duration-400 ease-in-out
    ${favorite ? "opacity-100 text-yellow-500 fill-yellow-500" : "hover:text-yellow-500 hover:fill-yellow-500"}`}
              onClick={(event) => favoriteSnippet(snippet, event)}
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
