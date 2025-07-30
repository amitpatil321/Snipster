import RootLayout from "components/layout/RootLayout";
import { ROUTES } from "config/routes.config";
import Folder from "pages/Folder/Folder";
import Platform from "pages/Platform/Platform";
import { createBrowserRouter } from "react-router";

import SnippetDetails from "./components/SnippetDetails";

// const SnippetList = React.lazy(() => import("pages/SnippetList/SnippetList"));

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <RootLayout />,
    children: [
      {
        path: ROUTES.ALL,
        element: <Platform />,
        children: [
          {
            path: `${ROUTES.DETAILS}/:id`,
            element: <SnippetDetails />,
          },
        ],
      },
      {
        path: ROUTES.FAVORITE,
        children: [
          {
            index: true,
            element: <Platform />,
          },
          {
            path: `${ROUTES.DETAILS}/:id`,
            element: <SnippetDetails />,
          },
        ],
      },
      {
        path: ROUTES.TRASH,
        children: [
          {
            index: true,
            element: <Platform />,
          },
          {
            path: `${ROUTES.DETAILS}/:id`,
            element: <SnippetDetails />,
          },
        ],
      },
      {
        path: `${ROUTES.FOLDER}/:folderId`,
        children: [
          {
            index: true,
            element: <Folder />,
          },
          {
            path: `${ROUTES.DETAILS}/:id`,
            element: <SnippetDetails />,
          },
        ],
      },
      {
        path: "*",
        element: <h1 className="text-xl">Not found!</h1>,
      },
    ],
  },
]);
