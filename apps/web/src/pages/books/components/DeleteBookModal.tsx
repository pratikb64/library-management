import { useBooksPageState } from "../books-page.state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useBooksStore } from "@/store/books.store";
import { toast } from "sonner";

export const DeleteBookModal = () => {
  const { deleteBookData, setDeleteBookModalData } = useBooksPageState();
  const { deleteBook } = useBooksStore();

  const onDeleteBook = () => {
    if (!deleteBookData?.book?.id) return;

    const loadingToastId = toast.loading("Deleting book...");

    deleteBook(deleteBookData.book.id);
    setDeleteBookModalData({
      isDeleteBookModalOpen: false,
      book: undefined,
    });

    toast.success("Book deleted successfully", { id: loadingToastId });
  };

  return (
    <Dialog
      open={deleteBookData?.isDeleteBookModalOpen || false}
      onOpenChange={(open) =>
        setDeleteBookModalData({
          isDeleteBookModalOpen: open,
          book: deleteBookData?.book,
        })
      }
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete book</DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="text-sm">
          Are you sure you want to delete
          <b> {deleteBookData?.book?.title}</b>?
        </div>
        <DialogFooter>
          <Button variant={"destructive"} onClick={onDeleteBook}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
