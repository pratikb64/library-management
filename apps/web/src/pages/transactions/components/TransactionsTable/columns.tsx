import { useTransactionsPageState } from "../../transactions-page.state";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Transaction } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

export const transactionsTableColumns: ColumnDef<Transaction>[] = [
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
    header: "Member",
    cell: ({ row }) => {
      return (
        <div className="w-48 overflow-hidden text-ellipsis whitespace-nowrap">{`${row.original.member.first_name} ${row.original.member.last_name}`}</div>
      );
    },
  },
  {
    header: "Book",
    cell: ({ row }) => {
      return (
        <div className="w-48 overflow-hidden text-ellipsis whitespace-nowrap">
          {row.original.book.title}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "issue_date",
    header: "Issue Date",
    cell: ({ row }) => (
      <div>{new Date(row.getValue("issue_date")).toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: "return_date",
    header: "Return Date",
    cell: ({ row }) => (
      <div>
        {row.getValue("return_date")
          ? new Date(row.getValue("return_date")).toLocaleDateString()
          : "Not returned"}
      </div>
    ),
  },
  {
    id: "fee_charged",
    accessorKey: "fee_charged",
    header: "Fee Charged",
    cell: ({ row }) => {
      const rentFee = parseFloat(row.getValue("fee_charged"));

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
      const { setEditTransactionModalData, setDeleteTransactionModalData } =
        useTransactionsPageState();

      const onDeleteClick = () => {
        setDeleteTransactionModalData({
          isDeleteTransactionModalOpen: true,
          transaction: row.original,
        });
      };

      const onEditClick = () => {
        setEditTransactionModalData({
          isEditTransactionModalOpen: true,
          transaction: row.original,
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
              <DropdownMenuItem
                className="flex w-full cursor-pointer items-center gap-2 text-xs"
                onClick={onEditClick}
              >
                <PencilIcon className="mr-1 size-3.5" />
                <span>Edit</span>
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
