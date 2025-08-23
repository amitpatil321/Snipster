import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router";

import AddFolder from "../AddFolder/AddFolder";

import type { RootState } from "@/store/index";

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
          <div className="bg-card shadow-lg m-4 p-2 border rounded-lg">
            <Header />
          </div>
          <div className="flex flex-row gap-4 p-4 pt-0 h-screen">
            <Outlet />
          </div>
        </div>
      </SidebarInset>

      <Dialog
        open={openModal}
        onOpenChange={() => dispatch(toggleAddSnippet({ state: !openModal }))}
      >
        <DialogContent className="min-w-[900px] font-sans">
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
