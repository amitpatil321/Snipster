import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { z } from "zod";

import type { snippetSchema } from "@/schema/snippet.schema";
import type { RootState } from "@/store";
import type { AxiosError } from "axios";

import { updateSnippet } from "@/services/snippet.service";
import { setSnippetDetails } from "@/store/app/appSlice";

type SnippetPayload = z.infer<typeof snippetSchema>;

export const useUpdateSnippet = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const snippetDetails = useSelector(
    (state: RootState) => state.app.snippetDetails,
  );

  return useMutation({
    mutationFn: (changedFields: SnippetPayload) => updateSnippet(changedFields),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["getSnippets", "all"] });
      queryClient.invalidateQueries({
        queryKey: ["getSnippetDetails", response.message.id],
      });
      if (snippetDetails)
        dispatch(setSnippetDetails({ ...snippetDetails, ...response.data }));
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
