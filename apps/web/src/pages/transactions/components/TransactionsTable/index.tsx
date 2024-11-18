import { TransactionSearch } from "../TransactionSearch";
import { transactionsTableColumns } from "./columns";
import { AppTable } from "@/components/AppTable";
import { GetTransactionsArgs } from "@/services/transactions.services";
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
  fetchTransactionsQuery?: GetTransactionsArgs;
}

export const TransactionsTable = (props: Props) => {
  const { fetchTransactions, transactions, asyncStates } =
    useTransactionsStore();

  useEffect(() => {
    fetchTransactions(props.fetchTransactionsQuery).catch(() => {
      toast.error("Something went wrong, try again later!");
    });
  }, []);

  return (
    <AppTable
      columns={transactionsTableColumns}
      data={transactions}
      pageSize={props.pageSize || 12}
      isDataFetching={
        asyncStates.fetchTransactionsAsyncState === AsyncState.Pending
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
