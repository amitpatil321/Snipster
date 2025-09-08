import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import type { RootState } from "@/store";
import type { AxiosError } from "axios";

import { toggleFavorite } from "@/services/snippet.service";
import { setSnippetDetails } from "@/store/app/appSlice";
import {
  cancelQueries,
  getSnapshot,
  setSnapshot,
  toggleFavoriteSnippet,
} from "@/utils/queryCache.utils";

type Payload = { ids: string[]; status: boolean };

const useToggleFavorite = (
  setSelectedSnippets?: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const currentPage = useSelector((state: RootState) => state.app.currentPage);
  const snippetDetails = useSelector(
    (state: RootState) => state.app.snippetDetails,
  );
  const affectedKeys = ["all", "favorite", "trash"];
  const countsKey = ["snippetCounts"];

  return useMutation({
    mutationFn: (payload: Payload) => toggleFavorite(payload),
    onMutate: async (payload) => {
      const ids = payload.ids;
      const status = payload.status;

      if (setSelectedSnippets) setSelectedSnippets([]);

      await cancelQueries(queryClient, affectedKeys);
      // Capture snapshots for all lists
      const previousData = getSnapshot(queryClient, affectedKeys);
      previousData.counts = queryClient.getQueryData(countsKey);

      toggleFavoriteSnippet(queryClient, currentPage?.type, ids, status);

      // handle details page toggle favorite
      if (snippetDetails)
        dispatch(setSnippetDetails({ ...snippetDetails, favorite: status }));
      return { previousData };
    },

    onError: (_err, payload, context) => {
      const err = _err as AxiosError<{ message?: string }>;
      toast.error(
        err?.response?.data?.message ||
          "Failed to update status. Please try again.",
      );

      // handle details page toggle favorite
      if (snippetDetails)
        dispatch(
          setSnippetDetails({ ...snippetDetails, favorite: !payload.status }),
        );

      setSnapshot(queryClient, affectedKeys, context?.previousData);
      queryClient.setQueryData(countsKey, context?.previousData.counts);
    },
    onSettled: () => {},
  });
};

export default useToggleFavorite;
