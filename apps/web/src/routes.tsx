import { BooksPage } from "./pages/books";
import { HomePage } from "./pages/home";
import { MembersPage } from "./pages/members";

export const routes = [
  {
    title: "Home",
    path: "/",
    element: <HomePage />,
    showInSidebar: true,
  },
  {
    title: "Books",
    path: "/books",
    element: <BooksPage />,
    showInSidebar: true,
  },
  {
    title: "Members",
    path: "/members",
    element: <MembersPage />,
    showInSidebar: true,
  },
];
