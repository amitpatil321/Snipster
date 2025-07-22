import { SidebarProvider } from "components/ui/sidebar";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router";

import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./providers/AuthProvider.tsx";
import ReactQueryProvider from "./providers/ReactQueryProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SidebarProvider>
      <AuthProvider>
        <ReactQueryProvider>
          <App />
        </ReactQueryProvider>
      </AuthProvider>
    </SidebarProvider>
  </StrictMode>,
);
