import { memo, useCallback, useContext, useRef } from "react";
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
  // const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);
  const { folderId: paramFolderId } = useParams();
  const currentPage = useSelector((state: RootState) => state.app.currentPage);

  const { _id = null, title, folderId, createdAt } = snippet;

  const detailUrl = _id
    ? getSnippetDetailUrl({
        base: currentPage?.type || "all",
        id: _id,
        paramFolderId,
      })
    : "";

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (selectedSnippets.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        if (snippet._id) handleCheckboxClick(e, snippet._id);
      } else {
        setSelected(snippet._id);
      }
    },
    [selectedSnippets.length, handleCheckboxClick, snippet._id, setSelected],
  );

  return (
    <Link
      key={_id}
      className={`${selected === snippet._id ? "bg-muted" : ""} ${!_id && "cursor-not-allowed text-gray-500 bg-gray-200"} group flex flex-col gap-1 px-3 py-3 transition-colors hover:bg-accent hover:text-accent-foreground`}
      to={`${detailUrl}`}
      onClick={handleClick}
      onMouseEnter={() => (isHoveredRef.current = true)}
      onMouseLeave={() => (isHoveredRef.current = false)}
    >
      <div className="flex justify-between items-center">
        {_id &&
          (currentPage!.type === ROUTES.ALL ||
            [ROUTES.FAVORITE, ROUTES.TRASH, ROUTES.FOLDER].includes(
              // disable checkbox for folders
              currentPage!.type,
            )) &&
          (selectedSnippets.length > 0 || isHoveredRef) && (
            <div
              className={`transition-all mr-1 translate-x-[0px] duration-100 checkbox-wrapper ${
                selectedSnippets.length > 0
                  ? "block translate-x-0"
                  : "hidden group-hover:block group-hover:translate-x-0"
              }`}
            >
              <Checkbox
                onClick={(event) => handleCheckboxClick(event, _id)}
                checked={selectedSnippets.includes(_id)}
                aria-label={`Select snippet with ID ${_id}`}
              />
            </div>
          )}
        <h3
          className={`${!_id && "pl-4"} font-medium text-base line-clamp-1 transition-transform group-hover:translate-x-[3px] duration-100 basis-[90%]`}
        >
          {title}
        </h3>
        {_id && (
          <SnippetActions
            snippet={snippet}
            currentPageType={currentPage?.type || "all"}
          />
        )}
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
