import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import type { RootState } from "@/store";
import type { Snippet } from "@/types/snippet.types";

import { toggleRemove } from "@/services/snippet.service";
import { setSnippetDetails } from "@/store/app/appSlice";
import {
  cancelQueries,
  deleteSnippets,
  getSnapshot,
  setSnapshot,
} from "@/utils/queryCache.utils";

type Payload = { ids: string[]; status: boolean };

export const useToggleRemove = (
  // snippet: Snippet,
  options?: {
    onSuccess?: () => void;
  },
) => {
  const queryClient = useQueryClient();
  const currentPage = useSelector((state: RootState) => state.app.currentPage);
  const dispatch = useDispatch();
  const snippetDetails = useSelector(
    (state: RootState) => state.app.snippetDetails,
  );

  const affectedKeys = ["all", "favorite", "trash"];
  const countsKey = ["snippetCounts"];

  return useMutation({
    mutationFn: (payload: Payload) => toggleRemove(payload),
    onMutate: async (payload) => {
      await cancelQueries(queryClient, affectedKeys);

      // Capture snapshots for all lists
      const previousData = getSnapshot(queryClient, affectedKeys);
      previousData.counts = queryClient.getQueryData(countsKey);

      deleteSnippets(queryClient, currentPage?.type, payload.ids);

      // if its snippet details page then remove selected snippet from redux store
      if (snippetDetails) {
        dispatch(setSnippetDetails(null));
      }

      return { previousData };
    },
    onError: (_err, payload, context) => {
      toast.error("Failed to remove snippet. Please try again.");

      if (context?.previousData) {
        setSnapshot(queryClient, affectedKeys, context?.previousData);
        queryClient.setQueryData(countsKey, context?.previousData.counts);
      }

      // set snippet to detaisl page in redux store
      if (snippetDetails) {
        const allSnippets = queryClient.getQueryData<{ data: Snippet[] }>([
          "getSnippets",
          "all",
        ])?.data;
        const snippet = allSnippets?.find(
          (each) => each._id === payload.ids[0],
        );
        dispatch(setSnippetDetails(snippet));
      }
    },
    onSettled: () => {
      // Invalidate deleted list
      // const queryKey = ["getSnippets", "all"];
      // queryClient.invalidateQueries({ queryKey: ["getSnippets", "trash"] });
      // queryClient.invalidateQueries({ queryKey: queryKey });
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
  });
};

export default useToggleRemove;
