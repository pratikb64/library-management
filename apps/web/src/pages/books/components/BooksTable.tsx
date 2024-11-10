import { useBooksPageState } from "../books-page.state";
import { BookSearch } from "./BookSearch";
import { BooksTableRowSkeleton } from "./BooksTableRowSkeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBooksStore } from "@/store/books.store";
import { AsyncState, Book } from "@/types";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="w-40 overflow-hidden text-ellipsis whitespace-nowrap">
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "authors",
    header: "Authors",
    cell: ({ row }) => (
      <div className="w-40 overflow-hidden text-ellipsis whitespace-nowrap">
        {row.getValue("authors")}
      </div>
    ),
  },
  {
    accessorKey: "average_rating",
    header: "Average Rating",
    cell: ({ row }) => <div>{row.getValue("average_rating")}</div>,
  },
  {
    accessorKey: "language_code",
    header: "Language Code",
    cell: ({ row }) => <div>{row.getValue("language_code")}</div>,
  },
  {
    accessorKey: "publication_date",
    header: "Publication Date",
    cell: ({ row }) => (
      <div>
        {new Date(row.getValue("publication_date")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "rent_fee",
    header: "Rent Fee / Day",
    cell: ({ row }) => {
      const rentFee = parseFloat(row.getValue("rent_fee"));

      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(rentFee);

      return <div>{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [isOpen, setIsOpen] = useState(false);
      const { setDeleteBookModalData } = useBooksPageState();

      const onDeleteClick = () => {
        setDeleteBookModalData({
          isDeleteBookModalOpen: true,
          book: row.original,
        });
      };

      return (
        <div className="flex justify-end">
          <DropdownMenu onOpenChange={setIsOpen} open={isOpen} modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open actions</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer text-xs">
                <Link
                  to={`/books/${row.original.id}`}
                  className="flex w-full items-center gap-2"
                >
                  <PencilIcon className="mr-1 size-3.5" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex w-full cursor-pointer items-center gap-2 text-xs text-red-500 hover:!text-red-600"
                onClick={onDeleteClick}
              >
                <TrashIcon className="mr-1 size-3" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export const BooksTable = () => {
  const { books, asyncStates } = useBooksStore();
  const areBooksFetching =
    asyncStates.fetchBooksAsyncState !== AsyncState.Success;

  const table = useReactTable({
    data: books,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <BookSearch />
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!areBooksFetching && !table.getRowModel().rows?.length && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-16 text-center"
                >
                  Books not found.
                </TableCell>
              </TableRow>
            )}

            {areBooksFetching && <BooksTableRowSkeleton />}
          </TableBody>
        </Table>
      </div>
      <div className="mt-6 flex items-center justify-center space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
