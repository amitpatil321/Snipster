import RootLayout from "components/layout/RootLayout";
import { ROUTES } from "config/routes.config";
import SnippetList from "pages/SnippetList/SnippetList";
import { createBrowserRouter } from "react-router";

// const SnippetList = React.lazy(() => import("pages/SnippetList/SnippetList"));

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <RootLayout />,
    children: [
      {
        path: ROUTES.ALL,
        element: <SnippetList />,
        children: [
          {
            path: `${ROUTES.DETAILS}/:id`,
            element: <SnippetList />,
          },
        ],
      },
      {
        path: ROUTES.FAVORITE,
        children: [
          {
            index: true,
            element: <SnippetList />,
          },
          {
            path: `${ROUTES.DETAILS}/:id`,
            element: <SnippetList />,
          },
        ],
      },
      {
        path: ROUTES.TRASH,
        children: [
          {
            index: true,
            element: <SnippetList />,
          },
          {
            path: `${ROUTES.DETAILS}/:id`,
            element: <SnippetList />,
          },
        ],
      },
    ],
  },
]);
