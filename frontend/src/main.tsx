import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { scan } from "react-scan";

import App from "./App.tsx";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/context/ThemeContext.tsx";
import { AuthProvider } from "@/providers/AuthProvider.tsx";
import ReactQueryProvider from "@/providers/ReactQueryProvider.tsx";
import ReduxProvider from "@/providers/ReduxProvider.tsx";
import { ToastProvider } from "@/providers/ToastProvider.tsx";

import "./index.css";

// scan({
//   enabled: true,
// });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider>
      <ReactQueryProvider>
        <AuthProvider>
          <ThemeProvider>
            <SidebarProvider>
              <App />
              <ToastProvider />
              <ReactQueryDevtools initialIsOpen={false} />
            </SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </ReactQueryProvider>
    </ReduxProvider>
  </StrictMode>,
);
