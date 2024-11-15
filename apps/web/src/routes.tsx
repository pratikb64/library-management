import { BooksPage } from "./pages/books";
import { HomePage } from "./pages/home";
import { IssueBook } from "./pages/issue-book";
import { MembersPage } from "./pages/members";
import { TransactionsPage } from "./pages/transactions";

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
    title: "Issue Book",
    path: "/issue-book",
    element: <IssueBook />,
    showInSidebar: true,
  },
  {
    title: "Members",
    path: "/members",
    element: <MembersPage />,
    showInSidebar: true,
  },
  {
    title: "Transactions",
    path: "/transactions",
    element: <TransactionsPage />,
    showInSidebar: true,
  },
];
