import { type Extension } from "@codemirror/state";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { Alert } from "components/Alert";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { dateString } from "lib/utils";
import {
  Folder,
  SquarePenIcon,
  Star,
  Trash,
  CalendarDays,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getExtensionsForLanguage } from "utils/getCodeMirrorExtension";

import DetailsLoading from "./DetailsLoading";

import type { UseMutateFunction } from "@tanstack/react-query";
import type { Snippet } from "types/snippet.types";
import type { Tag } from "types/tag.types";

interface Props {
  toggleFavorite: UseMutateFunction;
  snippet: Snippet;
  loading: boolean;
  error: boolean;
}

const SnippetDetailsView = ({
  loading,
  error,
  snippet,
  toggleFavorite,
}: Props) => {
  const {
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

  if (!snippet && !error) {
    return (
      <div className="m-2">
        <Alert type="info" title="Please select snippet to view details" />
      </div>
    );
  }

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
    <Card className="shadow-none -mt-2 border-none">
      <CardHeader className="-mb-6">
        <CardTitle className="flex flex-row justify-between items-center">
          <div className="font-semibold text-2xl">{title}</div>
          <div className="flex flex-row justify-center items-center gap-2">
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <SquarePenIcon /> Update
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-red-600 cursor-pointer"
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
        {description && <p className="text-muted-foreground">{description}</p>}
        <div className="flex items-center gap-4 -mt-2 mb-4 pb-2 border-b-1 text-muted-foreground text-sm">
          {folderId && (
            <div className="flex flex-row items-center gap-1">
              <Folder className="w-4 h-4" />
              {folderId?.name}
            </div>
          )}
          {tagIds ? (
            <div className="flex flex-row gap-2">
              {tagIds?.map((each: Tag) => (
                <Badge key={each._id} variant="default">
                  {each.name}
                </Badge>
              ))}
            </div>
          ) : null}
          {createdAt && (
            <div className="flex flex-row items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              Created {dateString(createdAt)}
            </div>
          )}
          {updatedAt && (
            <div className="flex flex-row items-center gap-1">
              <Clock className="w-4 h-4" />
              Updated {dateString(updatedAt)}
            </div>
          )}
        </div>
        {content && (
          <div className="rounded-lg">
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
              className="rounded-md h-[600px] overflow-auto"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SnippetDetailsView;
