"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "components/Loading";
import { Button } from "components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { Input } from "components/ui/input";
import MultipleSelector from "components/ui/multiselect";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "components/ui/select";
import { Textarea } from "components/ui/textarea";
import { CONFIG } from "config/config";
import { useGetFolders } from "hooks/user/useGetFolders";
import { FolderIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Folder } from "types/folder.types";

export default function AddSnippet() {
  const [tags] = useState([]);
  const { data: folders, isLoading: foldersLoading } = useGetFolders();

  // const OPTIONS = [
  //   { label: "nextjs", value: "Nextjs" },
  //   { label: "React", value: "react" },
  //   { label: "Remix", value: "remix" },
  //   { label: "Vite", value: "vite" },
  //   { label: "Nuxt", value: "nuxt" },
  //   { label: "Vue", value: "vue" },
  //   { label: "Svelte", value: "svelte" },
  //   { label: "Angular", value: "angular" },
  //   { label: "Ember", value: "ember", disable: true },
  //   { label: "Gatsby", value: "gatsby", disable: true },
  //   { label: "Astro", value: "astro" },
  // ];
  const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().optional(),
    folder: z.string().optional(),
    tags: z.string().optional(),
    language: z.string().min(1, { message: "Language is required" }),
    content: z.string().min(1, { message: "Content is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      language: "",
      content: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <div className="bg-card shadow-lg p-4 border rounded-lg w-full md:w-2/3 lg:w-2/3 transition-opacity">
      <h2 className="mb-4 font-semibold text-xl tracking-tight">Add Snippet</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
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
                          placeholder="Snippet Title"
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
            <FormField
              control={form.control}
              name="folder"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start self-end gap-2 space-y-0 col-span-12 @5xl:col-span-12 col-start-auto">
                  <div className="w-full">
                    <FormControl>
                      {foldersLoading ? (
                        <Loading size="small" />
                      ) : (
                        <Select
                          key="folder"
                          {...field}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select folder" />
                          </SelectTrigger>
                          <SelectContent>
                            {folders?.map((each: Folder) => {
                              return (
                                <SelectItem key={each._id} value={each._id}>
                                  <FolderIcon />
                                  {each?.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      )}
                    </FormControl>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start self-end gap-2 space-y-0 col-span-12 @5xl:col-span-12 col-start-auto">
                  <div className="w-full">
                    <FormControl>
                      <Select
                        key="language"
                        {...field}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONFIG.LANGUAGES.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start self-end gap-2 space-y-0 col-span-12 @5xl:col-span-12 col-start-auto">
                  <div className="w-full">
                    <FormControl>
                      <MultipleSelector
                        {...field}
                        value={tags}
                        creatable
                        // defaultOptions={OPTIONS}
                        placeholder="Select related tags"
                        emptyIndicator={
                          <p className="text-gray-600 dark:text-gray-400 text-lg text-center leading-10">
                            No tags found
                          </p>
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              // control={form.control}
              name="submit"
              render={() => (
                <FormItem className="flex flex-col items-start self-end gap-2 space-y-0 col-span-12 col-start-auto">
                  <FormLabel className="hidden shrink-0">Submit</FormLabel>

                  <div className="w-full">
                    <FormControl>
                      <Button
                        key="submit-button-0"
                        id="submit-button-0"
                        name=""
                        className="w-full"
                        type="submit"
                        variant="default"
                      >
                        Submit
                      </Button>
                    </FormControl>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
