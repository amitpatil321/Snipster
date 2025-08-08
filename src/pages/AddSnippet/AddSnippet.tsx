import { type Option } from "components/ui/multiselect";
import { useAddSnippet } from "hooks/snippets/useAddSnippet";
import { useGetTags } from "hooks/tags/useGetTags";
import { useGetFolders } from "hooks/user/useGetFolders";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { snippetSchema } from "schema/snippet.schema";
import { toggleAddSnippet } from "store/app/appSlice";
import { z } from "zod";

import AddSnippetView from "./AddSnippet.view";

import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";

export default function AddSnippet() {
  const [tagsArr, setTags] = useState<Option[] | undefined>([]);
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  const dispatch = useDispatch();
  const { data: folders, isLoading: foldersLoading } = useGetFolders();
  const { data: tags, isLoading: tagsLoading } = useGetTags();
  const addSnippetMutation = useAddSnippet();

  const onSubmit = async (values: z.infer<typeof snippetSchema>) => {
    addSnippetMutation.mutate(values, {
      onSuccess: () => {
        // hide modal
        dispatch(toggleAddSnippet(false));
      },
      onError: () => {},
    });
  };

  return (
    <AddSnippetView
      tagsArr={tagsArr}
      setTags={setTags}
      folders={folders}
      foldersLoading={foldersLoading}
      tags={tags}
      tagsLoading={tagsLoading}
      onSubmit={onSubmit}
      editorRef={editorRef}
      isLoading={addSnippetMutation.isPending}
    />
  );
}
