import { useTransactionsPageState } from "../transactions-page.state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useTransactionsStore } from "@/store/transactions.store";
import { AsyncState } from "@/types";
import { toast } from "sonner";

export const DeleteTransactionModal = () => {
  const { deleteTransactionData, setDeleteTransactionModalData } =
    useTransactionsPageState();
  const { deleteTransaction, asyncStates } = useTransactionsStore();

  const onDeleteTransaction = async () => {
    if (!deleteTransactionData?.transaction?.id) return;

    const loadingToastId = toast.loading("Deleting transaction...");

    try {
      await deleteTransaction(deleteTransactionData.transaction.id);
      setDeleteTransactionModalData({
        isDeleteTransactionModalOpen: false,
        transaction: undefined,
      });

      toast.success("Transaction deleted successfully", { id: loadingToastId });
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToastId });
    }
  };

  const onOpenChange = (isOpen: boolean) => {
    if (asyncStates.deleteTransactionAsyncState === AsyncState.Pending) return;
    setDeleteTransactionModalData({
      isDeleteTransactionModalOpen: isOpen,
      transaction: deleteTransactionData?.transaction,
    });
  };

  return (
    <Dialog
      open={deleteTransactionData?.isDeleteTransactionModalOpen}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete transaction</DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="text-sm">
          Are you sure you want to delete this transaction ?
        </div>
        <DialogFooter>
          <Button
            variant={"destructive"}
            onClick={onDeleteTransaction}
            disabled={
              asyncStates.deleteTransactionAsyncState === AsyncState.Pending
            }
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
