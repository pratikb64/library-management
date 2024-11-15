import { useBooksPageState } from "../../books-page.state";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Book } from "@/types";
import { CellContext } from "@tanstack/react-table";
import { MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

export const BooksTableActions = ({ row }: CellContext<Book, unknown>) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setDeleteBookModalData, setEditBookModalData } = useBooksPageState();

  const onDeleteClick = () => {
    setDeleteBookModalData({
      isDeleteBookModalOpen: true,
      book: row.original,
    });
  };

  const onEditClick = () => {
    setEditBookModalData({
      isEditBookModalOpen: true,
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
};
