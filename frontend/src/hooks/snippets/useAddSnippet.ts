import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { z } from "zod";

import type { snippetSchema } from "@/schema/snippet.schema";
import type { Folder } from "@/types/folder.types";
import type { Snippet } from "@/types/snippet.types";
import type { AxiosError } from "axios";

import { ROUTES } from "@/config/routes.config";
import { addSnippet } from "@/services/snippet.service";
import { toggleAddSnippet } from "@/store/app/appSlice";
import { addSnippetWithData } from "@/utils/queryCache.utils";

type SnippetPayload = z.infer<typeof snippetSchema>;

export const useAddSnippet = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (formData: SnippetPayload) => addSnippet(formData),
    onMutate: async (payload) => {
      const allQueryKey = ["getSnippets", "all"];
      const folders = ["getFolders"];
      await queryClient.cancelQueries({ queryKey: allQueryKey });

      // hide add snipept form
      await dispatch(toggleAddSnippet({ state: false }));

      // On adding new snippet go to /all page always since its new snippet
      navigate(ROUTES.ALL);

      const previousData = {
        allSnippets: queryClient.getQueryData<{ data: Snippet[] }>(allQueryKey),
        folders: queryClient.getQueryData<{ data: Folder[] }>(folders),
      };
      const optimisticSnippet = {
        ...payload,
        _id: "",
        createdAt: new Date(),
        userId: "",
        folderId: previousData?.folders?.data.find(
          (each: Folder) => each._id === payload.folder,
        ),
        favorite: false,
        updatedAt: new Date(),
      } as Snippet;

      addSnippetWithData(queryClient, allQueryKey, optimisticSnippet);

      return { previousData, optimisticSnippet };
    },
    onError: (_err, payload, context) => {
      const err = _err as AxiosError<{ message?: string }>;
      toast.error(
        err?.response?.data?.message ||
          "Failed to add snippet. Please try again.",
      );
      if (context?.previousData) {
        queryClient.setQueryData(
          ["getSnippets", "all"],
          context?.previousData.allSnippets,
        );
      }
      // bring back snippet form with prefilled data
      dispatch(toggleAddSnippet({ state: true, data: payload }));
    },
    onSuccess: (response, _, context) => {
      const allQueryKey = ["getSnippets", "all"];
      queryClient.setQueryData<{ data: Snippet[] }>(allQueryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: [
            ...(context?.previousData?.allSnippets?.data ?? []),
            response.data,
          ],
        };
      });
    },
  });
};
