import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";

const router = createBrowserRouter([
  ...routes.map((route) => ({
    path: route.path,
    element: route.element,
  })),
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
