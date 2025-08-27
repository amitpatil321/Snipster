import AddFolderView from "./AddFolder.view";

import { useAddFolder } from "@/hooks/folder/useAddFolder";
import { useRenameFolder } from "@/hooks/folder/useRenameFolder";

const AddFolder = ({
  folder,
}: {
  folder?: { id: string; name: string } | null;
}) => {
  const addFolderMutation = useAddFolder();
  const renameFolderMutation = useRenameFolder();
  return (
    <AddFolderView
      folder={folder || null}
      addFolderMutation={addFolderMutation}
      renameFolderMutation={renameFolderMutation}
    />
  );
};

export default AddFolder;
