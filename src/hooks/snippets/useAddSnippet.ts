import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { z } from "zod";

import type { snippetSchema } from "@/schema/snippet.schema";
import type { AxiosError } from "axios";

import { addSnippet } from "@/services/snippet.service";

type SnippetPayload = z.infer<typeof snippetSchema>;

export const useAddSnippet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: SnippetPayload) => addSnippet(formData),
    onSuccess: () => {
      toast.success("Snippet added successfully!");
      queryClient.invalidateQueries({ queryKey: ["getSnippets", "all", null] });
    },
    onError: (_err) => {
      const err = _err as AxiosError<{ message?: string }>;
      toast.error(
        err?.response?.data?.message ||
          "Failed to add snippet. Please try again.",
      );
      console.error("Error adding snippet:", err);
    },
  });
};
