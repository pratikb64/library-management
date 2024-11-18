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
import { AsyncState } from "@/types";
import { toast } from "sonner";

export const DeleteBookModal = () => {
  const { deleteBookData, setDeleteBookModalData } = useBooksPageState();
  const { deleteBook, asyncStates } = useBooksStore();

  const onDeleteBook = async () => {
    if (!deleteBookData?.book?.id) return;

    const loadingToastId = toast.loading("Deleting book...");
    try {
      await deleteBook(deleteBookData.book.id);
      setDeleteBookModalData({
        isDeleteBookModalOpen: false,
        book: undefined,
      });

      toast.success("Book deleted successfully", { id: loadingToastId });
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToastId });
    }
  };

  const onOpenChange = (isOpen: boolean) => {
    if (asyncStates.deleteBookAsyncState === AsyncState.Pending) return;
    setDeleteBookModalData({
      isDeleteBookModalOpen: isOpen,
      book: deleteBookData?.book,
    });
  };

  return (
    <Dialog
      open={deleteBookData?.isDeleteBookModalOpen}
      onOpenChange={onOpenChange}
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
          <Button
            variant={"destructive"}
            onClick={onDeleteBook}
            disabled={asyncStates.deleteBookAsyncState === AsyncState.Pending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
