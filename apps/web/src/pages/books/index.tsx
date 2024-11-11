import { AddBookModal } from "./components/AddBookModal";
import { BooksPageActions } from "./components/BooksPageActions";
import { BooksTable } from "./components/BooksTable";
import { DeleteBookModal } from "./components/DeleteBookModal";
import { EditBookModal } from "./components/EditBookModal";
import { ImportBooksModal } from "./components/ImportBooksModal";
import { AppLayout } from "@/components/app-layout";
import { useBooksStore } from "@/store/books.store";
import { useEffect } from "react";
import { toast } from "sonner";

export const BooksPage = () => {
  const { fetchBooks } = useBooksStore();

  useEffect(() => {
    fetchBooks().catch(() => {
      toast.error("Something went wrong, try again later!");
    });
  }, []);

  return (
    <AppLayout title={"Books"} actions={<BooksPageActions />}>
      <BooksTable />
      <DeleteBookModal />
      <AddBookModal />
      <ImportBooksModal />
      <EditBookModal />
    </AppLayout>
  );
};
