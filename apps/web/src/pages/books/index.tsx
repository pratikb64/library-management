import { AddBookModal } from "./components/AddBookModal";
import { BooksPageActions } from "./components/BooksPageActions";
import { BooksTable } from "./components/BooksTable";
import { DeleteBookModal } from "./components/DeleteBookModal";
import { EditBookModal } from "./components/EditBookModal";
import { ImportBooksModal } from "./components/ImportBooksModal";
import { AppLayout } from "@/components/app-layout";

export const BooksPage = () => {
  return (
    <AppLayout title={"Books"} actions={<BooksPageActions />}>
      <BooksTable
        columnVisibility={{
          selectRow: false,
        }}
        showPagination={true}
      />
      <DeleteBookModal />
      <AddBookModal />
      <ImportBooksModal />
      <EditBookModal />
    </AppLayout>
  );
};
