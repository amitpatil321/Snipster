import RootLayout from "components/layout/RootLayout";
import { ROUTES } from "config/routes.config";
import { lazy } from "react";
// import Folder from "pages/Folder/Folder";
// import Platform from "pages/Platform/Platform";
// import SnippetDetails from "pages/SnippetDetails/SnippetDetails";
import { createBrowserRouter } from "react-router";

const Platform = lazy(() => import("pages/Platform/Platform"));
const Folder = lazy(() => import("pages/Folder/Folder"));
// const SnippetDetails = lazy(
//   () => import("pages/SnippetDetails/SnippetDetails"),
// );

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
            element: <Platform />,
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
            element: <Platform />,
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
            element: <Platform />,
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
            element: <Folder />,
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
