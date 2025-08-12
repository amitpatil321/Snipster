import { RouterProvider } from "react-router";

import { router } from "./AppRouter.tsx";
import "./App.css";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
