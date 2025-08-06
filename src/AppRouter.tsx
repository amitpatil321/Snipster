import RootLayout from "components/layout/RootLayout";
import { ROUTES } from "config/routes.config";
import { lazy } from "react";
// import Folder from "pages/Folder/Folder";
// import Platform from "pages/Platform/Platform";
// import SnippetDetails from "pages/SnippetDetails/SnippetDetails";
import { createBrowserRouter } from "react-router";

const Platform = lazy(() => import("pages/Platform/Platform"));
const Folder = lazy(() => import("pages/Folder/Folder"));
const AddSnippet = lazy(() => import("pages/AddSnippet/AddSnippet"));
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
    path: `/${ROUTES.ADD}`,
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <AddSnippet />,
      },
    ],
  },
  {
    path: "*",
    element: <h1 className="text-xl">Not found!</h1>,
  },
]);
