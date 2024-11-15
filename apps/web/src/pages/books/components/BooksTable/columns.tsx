import { BooksTableActions } from "./BooksTableActions";
import { Checkbox } from "@/components/ui/checkbox";
import { Book } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const booksTableColumns: ColumnDef<Book>[] = [
  {
    id: "selectRow",
    cell: ({ row }) => (
      <Checkbox
        className="rounded-lg"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
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
    cell: (cellContext) => <BooksTableActions {...cellContext} />,
  },
];
