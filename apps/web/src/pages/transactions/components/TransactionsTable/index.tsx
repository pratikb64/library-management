import { TransactionSearch } from "../TransactionSearch";
import { transactionsTableColumns } from "./columns";
import { AppTable } from "@/components/AppTable";
import { useTransactionsStore } from "@/store/transactions.store";
import { AsyncState } from "@/types";
import { Table } from "@tanstack/react-table";
import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
  pageSize?: number;
  columnVisibility?: Record<string, boolean>;
  showPagination?: boolean;
  setTableInstance?: (table: Table<any> | undefined) => void;
}

export const TransactionsTable = (props: Props) => {
  const { fetchTransactions, transactions, asyncStates } =
    useTransactionsStore();

  useEffect(() => {
    fetchTransactions().catch(() => {
      toast.error("Something went wrong, try again later!");
    });
  }, []);

  return (
    <AppTable
      columns={transactionsTableColumns}
      data={transactions}
      pageSize={props.pageSize || 12}
      isDataFetching={
        asyncStates.fetchTransactionsAsyncState !== AsyncState.Success
      }
      isDataFetchingFailed={
        asyncStates.fetchTransactionsAsyncState === AsyncState.Error
      }
      tableSearch={<TransactionSearch />}
      columnVisibility={props.columnVisibility}
      showPagination={props.showPagination}
      setTableInstance={props.setTableInstance}
    />
  );
};
