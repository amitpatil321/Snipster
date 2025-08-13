import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { z } from "zod";

import type { snippetSchema } from "@/schema/snippet.schema";
import type { AxiosError } from "axios";

import { updateSnippet } from "@/services/snippet.service";

type SnippetPayload = z.infer<typeof snippetSchema>;

export const useUpdateSnippet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (changedFields: SnippetPayload) => updateSnippet(changedFields),
    onSuccess: (response) => {
      toast.success("Snippet updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["getSnippets", "all", null] });
      queryClient.invalidateQueries({
        queryKey: ["getSnippetDetails", response.message.id],
      });
    },
    onError: (_err) => {
      const err = _err as AxiosError<{ message?: string }>;
      toast.error(
        err?.response?.data?.message ||
          "Failed to update snippet. Please try again.",
      );
      console.error("Error adding snippet:", err);
    },
  });
};
