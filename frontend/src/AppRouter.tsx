import { lazy } from "react";
import { createBrowserRouter } from "react-router";

import RootLayout from "./components/layout/RootLayout";
import Home from "./pages/LandingPage/Home";

import { ROUTES } from "@/config/routes.config";

const Platform = lazy(() => import("@/pages/Platform/Platform"));
const Folder = lazy(() => import("@/pages/Folder/Folder"));

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Home />,
  },
  {
    element: <RootLayout />,
    children: [
      {
        path: ROUTES.ALL,
        element: <Platform />,
        children: [
          {
            path: `${ROUTES.DETAILS}/:id`,
            element: <Platform />,
          },
        ],
      },
      {
        path: ROUTES.FAVORITE,
        element: <Platform />,
        children: [
          {
            path: `${ROUTES.DETAILS}/:id`,
            element: <Platform />,
          },
        ],
      },
      {
        path: ROUTES.TRASH,
        element: <Platform />,
        children: [
          {
            path: `${ROUTES.DETAILS}/:id`,
            element: <Platform />,
          },
        ],
      },
      {
        path: `${ROUTES.FOLDER}/:folderId`,
        element: <Folder />,
        children: [
          {
            path: `${ROUTES.DETAILS}/:id`,
            element: <Folder />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <h1 className="text-xl">Not found!</h1>,
  },
]);
