import { routes } from "./routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

const router = createBrowserRouter([
  ...routes.map((route) => ({
    path: route.path,
    element: route.element,
  })),
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors={true} />
    </>
  );
}

export default App;
