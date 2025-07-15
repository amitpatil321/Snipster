import { RouterProvider } from "react-router";

import { router } from "./AppRouter.tsx";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
