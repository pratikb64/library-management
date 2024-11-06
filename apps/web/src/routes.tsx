import { Books } from "./pages/books";
import { Home } from "./pages/home";

export const routes = [
  {
    title: "Home",
    path: "/",
    element: <Home />,
  },
  {
    title: "Books",
    path: "/books",
    element: <Books />,
  },
];
