import { routes } from "./routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

const router = createBrowserRouter([
  ...routes.map((route) => ({
    path: route.path,
    lazy: route.lazy,
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
