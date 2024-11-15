import { useIssueBooksPageState } from "../issue-book-page.state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { AsyncState } from "@/types";
import { useCallback } from "react";
import { toast } from "sonner";

export const IssueBookModal = () => {
  const {
    issueBook,
    issueBookAsyncErrMessage,
    memberTableInstance,
    bookTableInstance,
    asyncStates,
    isIssueBookModalOpen,
    setIsIssueBookModalOpen,
    setIssueBookAsyncErrMessage,
  } = useIssueBooksPageState();

  const onIssueBookClick = useCallback(async () => {
    const selectedBook =
      bookTableInstance?.getSelectedRowModel().rows[0]?.original;
    const selectMember =
      memberTableInstance?.getSelectedRowModel().rows[0]?.original;

    if (!selectedBook?.id || !selectMember?.id) {
      toast.error("Please select a book and a member");
      return;
    }

    const loadingToastId = toast.loading("Issuing book...");

    try {
      await issueBook({
        book_id: selectedBook.id,
        member_id: selectMember.id,
      });

      memberTableInstance?.resetRowSelection();
      bookTableInstance?.resetRowSelection();
      setIsIssueBookModalOpen(false);

      toast.success("Book issued successfully", { id: loadingToastId });
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToastId });
    }
  }, [memberTableInstance, bookTableInstance, issueBook]);

  const onClose = () => {
    setIssueBookAsyncErrMessage("");
    setIsIssueBookModalOpen(false);
  };

  return (
    <Dialog open={isIssueBookModalOpen} onOpenChange={setIsIssueBookModalOpen}>
      <DialogContent
        className="max-h-screen overflow-auto md:max-w-sm"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Issue book</DialogTitle>
          <DialogDescription>
            Confirm details for book and member
          </DialogDescription>
          <Separator />
        </DialogHeader>
        <div className="text-sm">
          <div className="text-base">
            <div>
              <div>Issuing book</div>
              <div className="mt-1 text-base font-semibold">
                {
                  bookTableInstance?.getSelectedRowModel().rows[0]?.original
                    .title
                }
              </div>
            </div>
            <div className="mt-3">
              <div>To member</div>
              <div className="mt-1 text-base font-semibold">
                {
                  memberTableInstance?.getSelectedRowModel().rows[0]?.original
                    .first_name
                }{" "}
                {
                  memberTableInstance?.getSelectedRowModel().rows[0]?.original
                    .last_name
                }
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm text-red-500">
          {asyncStates.issueBookAsyncState === AsyncState.Error &&
            issueBookAsyncErrMessage}
        </div>
        <DialogFooter>
          <div className="flex gap-2">
            <Button onClick={onIssueBookClick}>Issue Book</Button>
            <Button onClick={onClose} variant={"outline"}>
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
