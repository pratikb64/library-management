import { useMembersPageState } from "../members-page.state";
import { MemberSearch } from "./MemberSearch";
import { TableRowSkeleton } from "@/components/TableRowSkeleton";
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
import { useMembersStore } from "@/store/members.store";
import { AsyncState, Member } from "@/types";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

export const columns: ColumnDef<Member>[] = [
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
      <div className="w-40 overflow-hidden text-ellipsis whitespace-nowrap">
        {row.getValue("email")}
      </div>
    ),
  },
  {
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

export const MembersTable = () => {
  const { members, asyncStates } = useMembersStore();
  const areMembersFetching =
    asyncStates.fetchMembersAsyncState !== AsyncState.Success;
  const fetchMembersErrored =
    asyncStates.fetchMembersAsyncState === AsyncState.Error;
  const pageSize = 12;

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div>
      <MemberSearch />
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

            {!fetchMembersErrored &&
              !areMembersFetching &&
              !table.getRowModel().rows?.length && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-16 text-center"
                  >
                    Members not found.
                  </TableCell>
                </TableRow>
              )}

            {!fetchMembersErrored && areMembersFetching && (
              <TableRowSkeleton rows={pageSize} columns={columns.length} />
            )}

            {fetchMembersErrored && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-16 text-center"
                >
                  Error fetching members.
                </TableCell>
              </TableRow>
            )}
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
