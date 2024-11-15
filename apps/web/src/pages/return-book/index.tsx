import { TransactionsTable } from "../transactions/components/TransactionsTable";
import { ReturnBookModal } from "./components/ReturnBookModal";
import { useReturnBooksPageState } from "./return-book-page.state";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ReturnBookPage = () => {
  const {
    transactionTableInstance,
    setIsReturnBookModalOpen,
    setTransactionTableInstance,
  } = useReturnBooksPageState();

  const onIssueBookClick = () => {
    const selectedTransaction =
      transactionTableInstance?.getSelectedRowModel().rows[0]?.original;

    if (!selectedTransaction?.id) {
      toast.error("Please select a book and a member");
      return;
    }

    setIsReturnBookModalOpen(true);
  };

  return (
    <AppLayout title={"Return Book"}>
      <div className="my-2 flex items-center gap-2">
        <Button onClick={onIssueBookClick}>Return selected book</Button>
      </div>
      <div>
        <TransactionsTable
          pageSize={5}
          columnVisibility={{ actions: false, fee_charged: false }}
          showPagination={false}
          setTableInstance={setTransactionTableInstance}
        />
      </div>
      <ReturnBookModal />
    </AppLayout>
  );
};
