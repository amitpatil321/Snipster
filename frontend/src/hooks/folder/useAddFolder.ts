import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { z } from "zod";

import type addFolderSchema from "@/schema/folder.schema";
import type { RootState } from "@/store";
import type { Folder } from "@/types/folder.types";
import type { AxiosError, AxiosResponse } from "axios";

import { createFolder } from "@/services/folder.services";
import { toggleAddFolder } from "@/store/app/appSlice";

type AddFolderPayload = z.infer<typeof addFolderSchema>;

interface AddFolderResponse {
  success: boolean;
  data: {
    id: string;
  };
}

export const useAddFolder = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const authId = user?.authId;

  return useMutation<
    AxiosResponse<AddFolderResponse>,
    Error,
    { name: string },
    { originalCopy?: Folder[]; optimisticFolder: Folder }
  >({
    mutationFn: (payload) => createFolder(payload),

    onMutate: (payload: AddFolderPayload) => {
      dispatch(toggleAddFolder(false));

      const originalCopy = queryClient.getQueryData<{ data: Folder[] }>([
        "getFolders",
      ])?.data;

      const optimisticFolder: Folder = {
        _id: "temp",
        name: payload.name,
        userId: authId!,
        snippetCount: 0,
        optimistic: true,
      };

      queryClient.setQueryData<{ data: Folder[] }>(["getFolders"], (old) => {
        if (!old) {
          return { data: [optimisticFolder] };
        }
        return { data: [...old.data, optimisticFolder] };
      });

      return { originalCopy, optimisticFolder };
    },

    onSuccess: (data, _payload, context) => {
      queryClient.setQueryData<{ data: Folder[] }>(["getFolders"], (old) => {
        if (!old) {
          return {
            data: [
              {
                ...context.optimisticFolder,
                _id: data.data.data.id,
                optimistic: false,
              },
            ],
          };
        }

        // Replace the optimistic folder with the actual one
        return {
          data: old.data.map((folder) =>
            folder._id === context.optimisticFolder._id
              ? {
                  ...folder,
                  _id: data.data.data.id,
                  optimistic: false,
                }
              : folder,
          ),
        };
      });
    },

    onError: (_err, _payload, context) => {
      const err = _err as AxiosError<{ message?: string }>;
      toast.error(
        err?.response?.data?.message ||
          "Failed to add folder. Please try again.",
      );

      if (context?.originalCopy) {
        queryClient.setQueryData<{ data: Folder[] }>(["getFolders"], {
          data: context.originalCopy,
        });
      }
    },
  });
};
