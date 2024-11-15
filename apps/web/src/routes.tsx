export const routes = [
  {
    title: "Home",
    path: "/",
    lazy: () => import("./pages/home").then((m) => ({ Component: m.HomePage })),
    showInSidebar: true,
  },
  {
    title: "Books",
    path: "/books",
    lazy: () =>
      import("./pages/books").then((m) => ({ Component: m.BooksPage })),
    showInSidebar: true,
  },
  {
    title: "Issue Book",
    path: "/issue-book",
    lazy: () =>
      import("./pages/issue-book").then((m) => ({
        Component: m.IssueBookPage,
      })),
    showInSidebar: true,
  },
  {
    title: "Return Book",
    path: "/return-book",
    lazy: () =>
      import("./pages/return-book").then((m) => ({
        Component: m.ReturnBookPage,
      })),
    showInSidebar: true,
  },
  {
    title: "Members",
    path: "/members",
    lazy: () =>
      import("./pages/members").then((m) => ({ Component: m.MembersPage })),
    showInSidebar: true,
  },
  {
    title: "Transactions",
    path: "/transactions",
    lazy: () =>
      import("./pages/transactions").then((m) => ({
        Component: m.TransactionsPage,
      })),
    showInSidebar: true,
  },
];
