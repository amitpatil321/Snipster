import { type Extension } from "@codemirror/state";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { Alert } from "components/Alert";
import { CopyButton } from "components/CopyButton";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { ROUTES } from "config/routes.config";
import { AnimatePresence, motion } from "framer-motion";
import { dateString } from "lib/utils";
import {
  CalendarDays,
  Clock,
  Folder,
  SquarePenIcon,
  Star,
  Trash,
} from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Link } from "react-router";
import { getExtensionsForLanguage } from "utils/getCodeMirrorExtension.util";

import DetailsLoading from "./DetailsLoading";

import type { UseMutateFunction } from "@tanstack/react-query";
import type { Snippet } from "types/snippet.types";
import type { Tag } from "types/tag.types";

interface Props {
  toggleFavorite: UseMutateFunction;
  toggleRemove: UseMutateFunction;
  updateSnippet: () => void;
  snippet: Snippet;
  loading: boolean;
  error: boolean;
}

const SnippetDetailsView = memo(
  ({
    loading,
    error,
    snippet,
    toggleFavorite,
    toggleRemove,
    updateSnippet,
  }: Props) => {
    const {
      _id,
      title,
      description,
      language,
      favorite,
      content,
      folderId,
      tagIds,
      createdAt,
      updatedAt,
    } = snippet || {};
    const [extensions, setExtensions] = useState<Extension[]>([]);

    useEffect(() => {
      getExtensionsForLanguage(language).then(setExtensions);
    }, [language]);

    if (loading) return <DetailsLoading />;

    if (error) {
      return (
        <div className="m-2">
          <Alert
            type="error"
            title="Error fetching snippet details"
            description="Please try again."
          />
        </div>
      );
    }

    return (
      <AnimatePresence initial={true}>
        <motion.div
          key={_id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          // exit={{ opacity: 0, y: 10 }}
        >
          <Card className="shadow-none -mt-2 border-none">
            <CardHeader className="-mb-6">
              <CardTitle className="flex flex-row justify-between items-center">
                <div className="font-semibold text-2xl">{title}</div>
                <div className="flex flex-row justify-center items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => updateSnippet()}
                  >
                    <SquarePenIcon /> Update
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-red-600 cursor-pointer"
                    onClick={() => toggleRemove()}
                  >
                    <Trash /> Delete
                  </Button>
                  <Star
                    className={`cursor-pointer w-5 h-5 text-gray-400 transition-colors duration-300 ease-in-out
    ${favorite ? "text-yellow-500 fill-yellow-500" : "hover:text-yellow-500 hover:fill-yellow-500"}`}
                    onClick={() => toggleFavorite()}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {description && (
                <span className="text-muted-foreground">{description}</span>
              )}
              {/* <div className="flex items-center gap-4 -mt-2 mb-4 pb-2 border-b-1 text-muted-foreground text-sm"> */}
              <div className="flex flex-row flex-wrap items-center place-content-between gap-4 mt-2 mb-4 pb-2 border-b-1 text-muted-foreground text-sm">
                <div className="flex flex-row gap-2">
                  {folderId && (
                    <div className="flex flex-row items-center gap-1">
                      <Folder className="w-4 h-4" />
                      {folderId?.name}
                    </div>
                  )}
                  {tagIds ? (
                    <div className="flex flex-wrap gap-2">
                      {tagIds?.map((each: Tag) => (
                        <Link to={`/${ROUTES.TAG}/${each._id}`}>
                          <Badge key={each._id} variant="default">
                            {each.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-row gap-2 text-sm">
                  {createdAt && (
                    <span className="flex justify-end items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      Created {dateString(createdAt)}
                    </span>
                  )}
                  {updatedAt && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Updated {dateString(updatedAt)}
                    </span>
                  )}
                </div>
              </div>
              {content && (
                <div className="relative flex-1 rounded-lg min-h-0 overflow-hidden">
                  <CopyButton
                    text={content}
                    className="top-2 right-6 z-10 absolute"
                  />
                  <CodeMirror
                    value={content}
                    extensions={[
                      extensions,
                      EditorView.lineWrapping,
                      EditorView.baseTheme({
                        ".cm-content": {
                          // fontFamily: "var(--font-sans)",
                          fontSize: "14px",
                        },
                      }),
                    ]}
                    // style={{
                    //   overflow: "auto",
                    //   height: 600,
                    // }}
                    readOnly
                    editable={false}
                    basicSetup={{
                      lineNumbers: true,
                      highlightActiveLine: false,
                    }}
                    theme={"dark"}
                    className="rounded-md h-[550px] overflow-auto"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  },
);

export default SnippetDetailsView;
