import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router";

import type { RootState } from "@/store/index";

import AddFolder from "@/components/AddFolder/AddFolder";
import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import SnippetForm from "@/components/SnippetForm/SnippetForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SidebarInset } from "@/components/ui/sidebar";
import { useSnippetCounts } from "@/hooks/snippets/useGetCounts";
import { useGetFolders } from "@/hooks/user/useGetFolders";
import { toggleAddFolder, toggleAddSnippet } from "@/store/app/appSlice";

const RootLayout = () => {
  const { data: counts, isLoading: countsLoading } = useSnippetCounts();
  const { data: folders, isLoading: foldersLoading } = useGetFolders();
  const dispatch = useDispatch();

  const {
    snippetForm: { state: openModal, data },
    addFolder,
  } = useSelector((state: RootState) => state.app);

  return (
    <div className="flex bg-background w-full min-h-screen font-sans transition-opacity">
      <AppSidebar
        counts={counts}
        loading={countsLoading}
        folders={folders}
        foldersLoading={foldersLoading}
      />
      <SidebarInset>
        <div className="flex flex-col bg-gradient-to-r from-background/75 to-10% to-transparent w-full h-screen">
          <div className="bg-card shadow-lg m-2 md:m-4 md:p-1 border rounded-lg">
            <Header />
          </div>
          <div className="flex flex-row p-2 md:p-4 md:pt-0 h-screen">
            <Outlet />
          </div>
        </div>
      </SidebarInset>

      <Dialog
        open={openModal}
        onOpenChange={() => dispatch(toggleAddSnippet({ state: !openModal }))}
      >
        {/* <DialogContent className="xl:border-red-400 w-full xl:!w-[800px] sm:max-w-lg font-sans"> */}
        <DialogContent className="!max-w-screen-md font-sans">
          <SnippetForm snippet={data} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={addFolder}
        onOpenChange={() => dispatch(toggleAddFolder(false))}
      >
        <DialogContent className="font-sans">
          <AddFolder />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RootLayout;
