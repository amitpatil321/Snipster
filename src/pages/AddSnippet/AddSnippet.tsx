import { zodResolver } from "@hookform/resolvers/zod";
import CodeMirror, { EditorView, type Extension } from "@uiw/react-codemirror";
import { ComboBox } from "components/combobox";
import Loading from "components/Loading";
import { Button } from "components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "components/ui/form";
import { Input } from "components/ui/input";
import MultipleSelector, { type Option } from "components/ui/multiselect";
import { Textarea } from "components/ui/textarea";
import { CONFIG } from "config/config";
import { useGetTags } from "hooks/tags/useGetTags";
import { useGetFolders } from "hooks/user/useGetFolders";
import { Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { snippetSchema } from "schema/snippet.schema";
import { getExtensionsForLanguage } from "utils/getCodeMirrorExtension.util";
import { z } from "zod";

export default function AddSnippet() {
  const [tagsArr, setTags] = useState<Option[]>([]);
  const editorRef = useRef(null);

  const { data: folders, isLoading: foldersLoading } = useGetFolders();
  const { data: tags, isLoading: tagsLoading } = useGetTags();
  const [extensions, setExtensions] = useState<Extension[]>([]);

  const form = useForm<z.infer<typeof snippetSchema>>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      title: "",
      description: "",
      folder: "",
      tags: [],
      language: "",
      content: "",
    },
  });
  const selectedLanguage = form.watch("language");

  const handleCopy = () => {
    if (editorRef.current) {
      // const value = editorRef.current?.viewState?.doc.toString() ?? "";
      // navigator.clipboard.writeText(value);
    }
  };

  useEffect(() => {
    if (selectedLanguage)
      getExtensionsForLanguage(selectedLanguage).then(setExtensions);
  }, [selectedLanguage]);

  function onSubmit(values: z.infer<typeof snippetSchema>) {
    const formattedTags = tagsArr.map((tag) => tag.value);
    console.log({ ...values, tags: formattedTags });
  }

  return (
    <div className="rounded-lg transition-opacity">
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
                            value={tagsArr}
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
                      onChange={(code) => console.log(code)}
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div onClick={handleCopy}>Copy</div>
            <div className="flex justify-end col-span-12 w-full">
              <Button
                className="w-full sm:w-auto"
                type="submit"
                variant="default"
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
