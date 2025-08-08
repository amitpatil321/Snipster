import AppSidebar from "components/AppSidebar";
import Header from "components/Header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import { SidebarInset } from "components/ui/sidebar";
import { useSnippetCounts } from "hooks/snippets/useGetCounts";
import { useGetFolders } from "hooks/user/useGetFolders";
import AddSnippet from "pages/AddSnippet/AddSnippet";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router";
import { toggleAddSnippet } from "store/app/appSlice";

import type { RootState } from "store/index";

const RootLayout = () => {
  const { data: counts, isLoading: countsLoading } = useSnippetCounts();
  const { data: folders, isLoading: foldersLoading } = useGetFolders();
  const dispatch = useDispatch();

  const addModalState = useSelector(
    (state: RootState) => state.app.addSnippetOpen,
  );

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
          <div className="flex flex-row gap-4 p-4 pt-0 h-full">
            <Outlet />
          </div>
        </div>
      </SidebarInset>

      {addModalState && (
        <Dialog
          open={addModalState}
          onOpenChange={() => dispatch(toggleAddSnippet(!addModalState))}
        >
          <DialogContent className="min-w-[900px] font-sans">
            <DialogHeader>
              <DialogTitle>Add Snippet</DialogTitle>
            </DialogHeader>
            <AddSnippet />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RootLayout;
