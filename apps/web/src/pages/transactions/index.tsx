import { DeleteTransactionModal } from "./components/DeleteTransactionModal";
import { EditTransactionModal } from "./components/EditTransactionModal";
import { TransactionsTable } from "./components/TransactionsTable";
import { AppLayout } from "@/components/app-layout";
import { useTransactionsStore } from "@/store/transactions.store";
import { useEffect } from "react";
import { toast } from "sonner";

export const TransactionsPage = () => {
  const { fetchTransactions } = useTransactionsStore();

  useEffect(() => {
    fetchTransactions().catch(() => {
      toast.error("Something went wrong, try again later!");
    });
  }, []);

  return (
    <AppLayout title={"Transactions"}>
      <TransactionsTable
        columnVisibility={{
          selectRow: false,
        }}
        showPagination={true}
      />
      <EditTransactionModal />
      <DeleteTransactionModal />
    </AppLayout>
  );
};
