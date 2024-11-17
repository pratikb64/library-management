import { useMembersPageState } from "../../members-page.state";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Member } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

export const membersTableColumns: ColumnDef<Member>[] = [
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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "first_name",
    header: "First Name",
    cell: ({ row }) => (
      <div className="w-40 overflow-hidden text-ellipsis whitespace-nowrap">
        {row.getValue("first_name")}
      </div>
    ),
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    cell: ({ row }) => (
      <div className="w-40 overflow-hidden text-ellipsis whitespace-nowrap">
        {row.getValue("last_name")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div
        className="w-40 overflow-hidden text-ellipsis whitespace-nowrap"
        title={row.getValue("email")}
      >
        {row.getValue("email")}
      </div>
    ),
  },
  {
    id: "joining_date",
    accessorKey: "joining_date",
    header: "Joining Date",
    cell: ({ row }) => (
      <div>{new Date(row.getValue("joining_date")).toLocaleDateString()}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [isOpen, setIsOpen] = useState(false);
      const { setDeleteMemberModalData, setEditMemberModalData } =
        useMembersPageState();

      const onDeleteClick = () => {
        setDeleteMemberModalData({
          isDeleteMemberModalOpen: true,
          member: row.original,
        });
      };

      const onEditClick = () => {
        setEditMemberModalData({
          isEditMemberModalOpen: true,
          member: row.original,
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
