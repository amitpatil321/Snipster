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
import { toggleAddFolder } from "@/store/app/appSlice";

type FolderFormValues = z.infer<typeof folderSchema>;

interface AddFolderResponse {
  success: boolean;
  data: {
    id: string;
  };
}
interface AddFolderViewType {
  addFolderMutation: UseMutationResult<
    AxiosResponse<AddFolderResponse>,
    Error,
    { name: string },
    unknown
  >;
}

const AddFolderView = ({ addFolderMutation }: AddFolderViewType) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FolderFormValues>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: FolderFormValues) => {
    addFolderMutation.mutate({ name: capitalize(data.name) });
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Add New Folder</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div>
          <Input
            placeholder="Enter folder name"
            {...register("name")}
            className="w-full"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => dispatch(toggleAddFolder(false))}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddFolderView;
