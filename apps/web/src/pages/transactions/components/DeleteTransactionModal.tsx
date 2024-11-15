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
import { toast } from "sonner";

export const DeleteTransactionModal = () => {
  const { deleteTransactionData, setDeleteTransactionModalData } =
    useTransactionsPageState();
  const { deleteTransaction } = useTransactionsStore();

  const onDeleteTransaction = () => {
    if (!deleteTransactionData?.transaction?.id) return;

    const loadingToastId = toast.loading("Deleting transaction...");

    try {
      deleteTransaction(deleteTransactionData.transaction.id);
      setDeleteTransactionModalData({
        isDeleteTransactionModalOpen: false,
        transaction: undefined,
      });

      toast.success("Transaction deleted successfully", { id: loadingToastId });
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToastId });
    }
  };

  return (
    <Dialog
      open={deleteTransactionData?.isDeleteTransactionModalOpen}
      onOpenChange={(open) =>
        setDeleteTransactionModalData({
          isDeleteTransactionModalOpen: open,
          transaction: deleteTransactionData?.transaction,
        })
      }
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
          <Button variant={"destructive"} onClick={onDeleteTransaction}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
