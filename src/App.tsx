import AppSidebar from "components/AppSidebar";
import Header from "components/Header";
import SnippetList from "components/SnippetList";
import { SidebarInset, SidebarProvider } from "components/ui/sidebar";

const App = () => {
  return (
    <SidebarProvider>
      <div className="flex bg-background h-screen font-sans transition-opacity">
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col bg-gradient-to-r from-background/75 to-10% to-transparent w-full h-screen">
            <div className="bg-card m-4 p-4 border rounded-lg h-20">
              <Header />
            </div>
            <div className="flex flex-row gap-4 p-4 pt-0 h-full">
              <div className="bg-card border rounded-xl w-1/3 text-card-foreground">
                <SnippetList />
              </div>
              <div className="flex-1 bg-card p-4 border rounded-lg text-card-foreground">
                <div className="flex-1 p-4 rounded-xl h-full text-sm whitespace-pre-wrap">
                  Hi, let's have a meeting tomorrow to discuss the project. I've
                  been reviewing the project details and have some ideas I'd
                  like to share. It's crucial that we align on our next steps to
                  ensure the project's success. Please come prepared with any
                  questions or insights you may have. Looking forward to our
                  meeting! Best regards, William
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default App;
