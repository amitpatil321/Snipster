import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SidebarProvider } from "components/ui/sidebar";
import { AuthProvider } from "providers/AuthProvider.tsx";
import ReactQueryProvider from "providers/ReactQueryProvider.tsx";
import ReduxProvider from "providers/ReduxProvider.tsx";
import { ToastProvider } from "providers/ToastProvider.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider>
      <ReactQueryProvider>
        <AuthProvider>
          <SidebarProvider>
            <App />
            <ToastProvider />
            <ReactQueryDevtools initialIsOpen={false} />
          </SidebarProvider>
        </AuthProvider>
      </ReactQueryProvider>
    </ReduxProvider>
  </StrictMode>,
);
