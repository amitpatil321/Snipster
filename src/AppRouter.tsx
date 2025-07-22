import RootLayout from "components/layout/RootLayout";
import { ROUTES } from "config/routes.config";
import { createBrowserRouter } from "react-router";

import SnippetList from "./components/SnippetList";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <RootLayout />,
    children: [
      {
        path: ROUTES.ALL,
        element: <SnippetList type="all" />,
        children: [
          {
            path: `${ROUTES.DETAILS}/:id`,
            element: <SnippetList type="all" />,
          },
        ],
      },
      {
        path: ROUTES.FAVORITE,
        children: [
          {
            index: true,
            element: <SnippetList type="favorite" />,
          },
          {
            path: `${ROUTES.DETAILS}/:id`,
            element: <SnippetList type="favorite" />,
          },
        ],
      },
      {
        path: ROUTES.TRASH,
        children: [
          {
            index: true,
            element: <SnippetList type="trash" />,
          },
          {
            path: `${ROUTES.DETAILS}/:id`,
            element: <SnippetList type="trash" />,
          },
        ],
      },
    ],
  },
]);
