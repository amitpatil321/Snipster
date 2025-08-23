import AddFolderView from "./AddFolder.view";

import { useAddFolder } from "@/hooks/folder/useAddFolder";

const AddFolder = () => {
  const addFolderMutation = useAddFolder();
  return <AddFolderView addFolderMutation={addFolderMutation} />;
};

export default AddFolder;
