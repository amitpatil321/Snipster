import AppSidebar from "components/AppSidebar";
import Header from "components/Header";
import { SidebarInset } from "components/ui/sidebar";
import { useSnippetCounts } from "hooks/snippets/useGetCounts";
import { useGetFolders } from "hooks/user/useGetFolders";
import { Outlet } from "react-router";

const RootLayout = () => {
  const { data: counts, isLoading: countsLoading } = useSnippetCounts();
  const { data: folders, isLoading: foldersLoading } = useGetFolders();

  return (
    <div className="flex bg-background w-full h-screen font-sans transition-opacity">
      <AppSidebar
        counts={counts}
        loading={countsLoading}
        folders={folders}
        foldersLoading={foldersLoading}
      />
      <SidebarInset>
        <div className="flex flex-col bg-gradient-to-r from-background/75 to-10% to-transparent w-full h-screen">
          <div className="bg-card m-4 p-4 border rounded-lg h-20">
            <Header />
          </div>
          <div className="flex flex-row gap-4 p-4 pt-0 h-full">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </div>
  );
};

export default RootLayout;
