import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { z } from "zod";

import SnippetFormView from "./SnippetForm.view";

import type { Snippet } from "@/types/snippet.types";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";

import { type Option } from "@/components/ui/multiselect";
import { useAddSnippet } from "@/hooks/snippets/useAddSnippet";
import { useUpdateSnippet } from "@/hooks/snippets/useUpdateSnippet";
import { useGetTags } from "@/hooks/tags/useGetTags";
import { useGetFolders } from "@/hooks/user/useGetFolders";
import { snippetSchema } from "@/schema/snippet.schema";
import { toggleAddSnippet } from "@/store/app/appSlice";

interface SnipeptFormProps {
  snippet?: Snippet | null;
}

const SnippetForm = ({ snippet }: SnipeptFormProps) => {
  const [tagsArr, setTags] = useState<Option[] | undefined>([]);
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  const dispatch = useDispatch();
  const { data: folders, isLoading: foldersLoading } = useGetFolders();
  const { data: tags, isLoading: tagsLoading } = useGetTags();
  const addSnippetMutation = useAddSnippet();
  const updateSnippetMutation = useUpdateSnippet();

  const onSubmit = async (values: z.infer<typeof snippetSchema>) => {
    if (values.id)
      updateSnippetMutation.mutate(values, {
        onSuccess: () => {
          dispatch(toggleAddSnippet({ state: false, data: null }));
        },
        onError: () => {},
      });
    else
      addSnippetMutation.mutate(values, {
        onSuccess: () => {
          dispatch(toggleAddSnippet({ state: false }));
        },
        onError: () => {},
      });
  };

  return (
    <SnippetFormView
      snippet={snippet}
      tagsArr={tagsArr}
      setTags={setTags}
      folders={folders}
      foldersLoading={foldersLoading}
      tags={tags}
      tagsLoading={tagsLoading}
      onSubmit={onSubmit}
      editorRef={editorRef}
      isLoading={
        addSnippetMutation.isPending || updateSnippetMutation.isPending
      }
    />
  );
};

export default SnippetForm;
