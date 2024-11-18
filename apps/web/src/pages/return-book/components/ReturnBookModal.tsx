import { useReturnBooksPageState } from "../return-book-page.state";
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
import { useBooksStore } from "@/store/books.store";
import { useTransactionsStore } from "@/store/transactions.store";
import { AsyncState, TransactionStatus } from "@/types";
import { useCallback } from "react";
import { toast } from "sonner";

export const ReturnBookModal = () => {
  const {
    transactionTableInstance,
    isReturnBookModalOpen,
    setIsReturnBookModalOpen,
  } = useReturnBooksPageState();

  const { returnBook, asyncStates } = useBooksStore();
  const { fetchTransactions } = useTransactionsStore();

  const onReturnBookClick = useCallback(async () => {
    const selectedTransaction =
      transactionTableInstance?.getSelectedRowModel().rows[0]?.original;

    if (!selectedTransaction?.id) {
      toast.error("Please select a book and a member");
      return;
    }

    const loadingToastId = toast.loading("Returning book...");

    try {
      await returnBook(selectedTransaction.id);

      transactionTableInstance?.resetRowSelection();
      setIsReturnBookModalOpen(false);

      toast.success("Book returned successfully", { id: loadingToastId });
      await fetchTransactions({ status: TransactionStatus.ISSUED });
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToastId });
    }
  }, [transactionTableInstance, returnBook]);

  const calculateBookRentFee = (
    issueDate: string,
    bookRentFee: number,
  ): string => {
    const issueDateObj = new Date(issueDate);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - issueDateObj.getTime();
    const daysSinceIssueDate =
      Math.floor(timeDifference / (1000 * 3600 * 24)) + 1;
    const totalFee = daysSinceIssueDate * bookRentFee;

    const formatted = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(totalFee);
    return formatted;
  };

  const onOpenChange = (isOpen: boolean) => {
    if (asyncStates.returnBookAsyncState === AsyncState.Pending) return;
    setIsReturnBookModalOpen(isOpen);
  };

  return (
    <Dialog open={isReturnBookModalOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-screen overflow-auto md:max-w-sm"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Return book</DialogTitle>
          <DialogDescription>
            Confirm details for book and member
          </DialogDescription>
          <Separator />
        </DialogHeader>
        <div className="text-sm">
          <div className="text-base">
            <div>
              <div>Returning book</div>
              <div className="mt-1 text-base font-semibold">
                {
                  transactionTableInstance?.getSelectedRowModel().rows[0]
                    ?.original.book.title
                }
              </div>
            </div>
            <div className="mt-3">
              <div>By member</div>
              <div className="mt-1 text-base font-semibold">
                {
                  transactionTableInstance?.getSelectedRowModel().rows[0]
                    ?.original.member.first_name
                }{" "}
                {
                  transactionTableInstance?.getSelectedRowModel().rows[0]
                    ?.original.member.last_name
                }
              </div>
            </div>
            <div className="mt-3">
              <div>Total book rent fee</div>
              <div className="mt-1 text-base font-semibold">
                {transactionTableInstance &&
                  calculateBookRentFee(
                    transactionTableInstance?.getSelectedRowModel().rows[0]
                      ?.original.issue_date,
                    transactionTableInstance?.getSelectedRowModel().rows[0]
                      ?.original.book.rent_fee,
                  )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="flex gap-2">
            <Button
              onClick={onReturnBookClick}
              disabled={asyncStates.returnBookAsyncState === AsyncState.Pending}
            >
              Return Book
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant={"outline"}
              disabled={asyncStates.returnBookAsyncState === AsyncState.Pending}
            >
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
