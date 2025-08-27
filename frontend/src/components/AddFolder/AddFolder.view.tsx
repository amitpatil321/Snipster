import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import type z from "zod";

import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { capitalize } from "@/lib/utils";
import folderSchema from "@/schema/folder.schema";
import { toggleAddFolder, toggleRenameFolder } from "@/store/app/appSlice";

type FolderFormValues = z.infer<typeof folderSchema>;

interface AddFolderResponse {
  success: boolean;
  data: {
    id: string;
  };
}
interface AddFolderViewType {
  folder?: { id: string; name: string } | null;
  addFolderMutation: UseMutationResult<
    AxiosResponse<AddFolderResponse>,
    Error,
    { name: string },
    unknown
  >;
  renameFolderMutation: UseMutationResult<
    AxiosResponse<AddFolderResponse>,
    Error,
    { id: string; name: string },
    unknown
  >;
}

const AddFolderView = ({
  folder,
  addFolderMutation,
  renameFolderMutation,
}: AddFolderViewType) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FolderFormValues>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: folder?.name || "",
    },
  });

  const onSubmit = async (data: FolderFormValues) => {
    if (!folder) {
      addFolderMutation.mutate({ name: capitalize(data.name) });
    } else {
      renameFolderMutation.mutate({
        id: folder?.id,
        name: capitalize(data.name),
      });
    }
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>{folder?.id ? "Rename Folder" : "Add Folder"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div>
          <Input
            placeholder="Enter folder name"
            {...register("name")}
            className="w-full"
            maxLength={15}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              dispatch(
                folder?.id ? toggleRenameFolder(null) : toggleAddFolder(false),
              )
            }
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? folder?.id
                ? "Updating..."
                : "Saving..."
              : folder?.id
                ? "Update"
                : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddFolderView;
