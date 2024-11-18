import { BookSearch } from "../BookSearch";
import { booksTableColumns } from "./columns";
import { AppTable } from "@/components/AppTable";
import { useBooksStore } from "@/store/books.store";
import { AsyncState } from "@/types";
import { Table } from "@tanstack/react-table";
import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
  pageSize?: number;
  columnVisibility?: Record<string, boolean>;
  showPagination?: boolean;
  setTableInstance?: (table: Table<any> | undefined) => void;
}

export const BooksTable = (props: Props) => {
  const { fetchBooks, books, asyncStates } = useBooksStore();

  useEffect(() => {
    fetchBooks().catch(() => {
      toast.error("Something went wrong, try again later!");
    });
  }, []);

  return (
    <AppTable
      columns={booksTableColumns}
      data={books}
      pageSize={props.pageSize || 12}
      isDataFetching={asyncStates.fetchBooksAsyncState === AsyncState.Pending}
      isDataFetchingFailed={
        asyncStates.fetchBooksAsyncState === AsyncState.Error
      }
      tableSearch={<BookSearch />}
      columnVisibility={props.columnVisibility}
      showPagination={props.showPagination}
      setTableInstance={props.setTableInstance}
    />
  );
};
