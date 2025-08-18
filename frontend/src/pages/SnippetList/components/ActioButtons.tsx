import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon, StarIcon, Trash, Undo } from "lucide-react";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/store";
import type { SnippetListContextType } from "@/types/app.types";

import FoldersDropdown from "@/components/FoldersDropdown";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/config/routes.config";
import { SnippetListContext } from "@/contexts/SnippetListContext";
import { toggleAddSnippet } from "@/store/app/appSlice";

const ActionButtons = () => {
  const {
    snippets,
    selectedSnippets,
    setSelectedSnippets,
    handleBulkFav,
    handleBulkDelete,
    currentPage,
  } = useContext(SnippetListContext) as SnippetListContextType;
  const dispatch = useDispatch();
  const addModalState = useSelector(
    (state: RootState) => state.app.snippetForm.state,
  );

  return (
    <div className="flex items-center p-1 border-b border-b-gray-200 h-12">
      <AnimatePresence mode="wait">
        {selectedSnippets.length > 0 ? (
          <motion.div
            key="bulk-actions"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col pl-3 w-full"
          >
            <div className="flex flex-row justify-between items-center">
              <div className="flex gap-2">
                <Checkbox
                  id="uncheckall"
                  checked={!!selectedSnippets.length}
                  onClick={() => setSelectedSnippets([])}
                />
                <Label htmlFor="uncheckall" className="cursor-pointer">
                  Clear
                  {selectedSnippets.length > 0 &&
                    "(" + selectedSnippets.length + ")"}
                </Label>
              </div>
              <div className="flex justify-end pr-1">
                <Button
                  variant="ghost"
                  className="cursor-pointer"
                  size="sm"
                  onClick={handleBulkFav}
                >
                  {currentPage?.path === `/` + ROUTES.FAVORITE ? (
                    <>
                      <StarIcon />
                      UnFavorite
                    </>
                  ) : (
                    <>
                      <StarIcon className="fill-yellow-500 text-yellow-500" />
                      Favorite
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:text-red-500 cursor-pointer"
                  onClick={handleBulkDelete}
                >
                  {currentPage?.path === `/` + ROUTES.TRASH ? (
                    <>
                      <Undo />
                      Restore
                    </>
                  ) : (
                    <>
                      <Trash />
                      Delete
                    </>
                  )}
                </Button>
                <FoldersDropdown />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="add-snippet"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex justify-between items-center p-2 pl-3 w-full"
          >
            <div className="font-bold text-foreground">
              {currentPage?.label}{" "}
              {snippets.length > 0 && "(" + snippets.length + ")"}
            </div>
            <Button
              variant="secondary"
              className="bg-primary hover:bg-primary-400 text-primary-foreground cursor-pointer"
              onClick={() =>
                dispatch(toggleAddSnippet({ state: !addModalState }))
              }
              size="sm"
            >
              <PlusIcon /> Add Snippet
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActionButtons;
