import { zodResolver } from "@hookform/resolvers/zod";
import CodeMirror, {
  EditorView,
  type Extension,
  type ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import { Tag } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";
import { useForm } from "react-hook-form";

import type { Snippet } from "@/types/snippet.types";
import type z from "zod";

import { ComboBox } from "@/components/combobox";
import { CopyButton } from "@/components/CopyButton";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MultipleSelector, { type Option } from "@/components/ui/multiselect";
import { Textarea } from "@/components/ui/textarea";
import { CONFIG } from "@/config/config";
import { snippetSchema } from "@/schema/snippet.schema";
import { getExtensionsForLanguage } from "@/utils/getCodeMirrorExtension.util";

interface SnippetFormViewProps {
  snippet: Snippet | null | undefined;
  tagsArr: Option[] | undefined;
  setTags: React.Dispatch<React.SetStateAction<Option[] | undefined>>;
  folders: { _id: string; value: string; label: string }[];
  foldersLoading: boolean;
  tags: { _id: string; value: string; label: string }[];
  tagsLoading: boolean;
  onSubmit: (values: z.infer<typeof snippetSchema>) => Promise<void>;
  editorRef: RefObject<ReactCodeMirrorRef | null>;
  isLoading: boolean;
}

const SnippetFormView = ({
  snippet,
  // tagsArr,
  setTags,
  folders,
  foldersLoading,
  tags,
  tagsLoading,
  onSubmit,
  editorRef,
  isLoading,
}: SnippetFormViewProps) => {
  const [extensions, setExtensions] = useState<Extension[]>([]);

  const form = useForm<z.infer<typeof snippetSchema>>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      id: snippet?._id || "null",
      title: snippet?.title || "",
      description: snippet?.description || "",
      folder:
        folders?.find((each) => each._id === snippet?.folderId?._id)?._id || "",
      tags:
        snippet?.tagIds?.map((tag) => ({ label: tag.name, value: tag._id })) ||
        [],
      language: snippet?.language || "",
      content: snippet?.content || "",
    },
  });
  const selectedLanguage = form.watch("language");
  useEffect(() => {
    if (selectedLanguage)
      getExtensionsForLanguage(selectedLanguage).then(setExtensions);
  }, [selectedLanguage]);

  return (
    <div className="rounded-lg transition-opacity">
      <DialogHeader className="mb-4">
        <DialogTitle>
          {snippet?._id ? "Update Snippet" : "Add Snippet"}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="@container space-y-8"
        >
          <div className="gap-4 grid grid-cols-12">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="@5xl:block flex flex-col items-start self-end gap-2 space-y-0 col-span-12 col-start-auto">
                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          key="title"
                          placeholder="Snippet Title *"
                          type="text"
                          id="title"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start self-end gap-2 space-y-0 col-span-12 @5xl:col-span-12 col-start-auto">
                  <div className="w-full">
                    <FormControl>
                      <Textarea
                        key="description"
                        id="description"
                        placeholder="Description"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div className="items-center gap-2 grid grid-cols-1 md:grid-cols-4 col-span-12 w-full">
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field: langField }) => (
                    <FormItem>
                      <FormControl>
                        <ComboBox
                          {...langField}
                          options={CONFIG.LANGUAGES}
                          className="w-full"
                          placeholder="Select language *"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="folder"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="col-span-1">
                        {foldersLoading ? (
                          <Loading size="small" />
                        ) : (
                          <ComboBox
                            name="folder"
                            options={folders}
                            valueKey="_id"
                            labelKey="name"
                            placeholder="Folder"
                            className="w-[90%]"
                          />
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className="col-span-8 md:col-span-3">
                      <FormControl>
                        {tagsLoading ? (
                          <Loading
                            size="small"
                            className="justify-center items-center"
                          />
                        ) : (
                          <MultipleSelector
                            {...field}
                            // value={tagsArr}
                            creatable
                            icon={<Tag />}
                            defaultOptions={tags || []}
                            placeholder="Tags"
                            className="w-full"
                            onChange={(option: Option[]) => {
                              setTags(option);
                              field.onChange(option);
                            }}
                            emptyIndicator={
                              <span className="text-gray-600 dark:text-gray-400 text-center">
                                No tags found
                              </span>
                            }
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 col-span-12 rounded-md">
                  <FormControl>
                    <div className="relative">
                      <CopyButton
                        text={
                          editorRef.current?.view?.state?.doc?.toString() ?? ""
                        }
                        className="top-2 right-4 z-10 absolute"
                      />

                      <CodeMirror
                        {...field}
                        ref={editorRef}
                        placeholder="/** Paste or write your code snippet here. **/"
                        extensions={[
                          extensions,
                          EditorView.lineWrapping,
                          EditorView.baseTheme({
                            ".cm-content": {
                              fontSize: "14px",
                            },
                          }),
                        ]}
                        // onChange={(code) => console.log(code)}
                        style={{
                          overflow: "auto",
                          minHeight: 300,
                          height: 300,
                        }}
                        basicSetup={{
                          lineNumbers: true,
                          highlightActiveLine: false,
                        }}
                        theme="dark"
                        className="bg-[#282C34] rounded-md overflow-auto"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end col-span-12 w-full">
              <Button
                className="w-full sm:w-auto cursor-pointer"
                type="submit"
                variant="default"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loading className="!text-muted" />
                    {snippet?._id ? "Updating..." : "Saving..."}
                  </>
                ) : snippet?._id ? (
                  "Update"
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SnippetFormView;
