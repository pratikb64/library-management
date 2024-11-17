import { BooksTable } from "../books/components/BooksTable";
import { MembersTable } from "../members/components/MembersTable";
import { IssueBookModal } from "./components/IssueBookModal";
import { useIssueBooksPageState } from "./issue-book-page.state";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const IssueBookPage = () => {
  const {
    memberTableInstance,
    bookTableInstance,
    setMemberTableInstance,
    setBookTableInstance,
    setIsIssueBookModalOpen,
  } = useIssueBooksPageState();

  const onIssueBookClick = () => {
    const selectedBook =
      bookTableInstance?.getSelectedRowModel().rows[0]?.original;
    const selectMember =
      memberTableInstance?.getSelectedRowModel().rows[0]?.original;

    if (!selectedBook?.id || !selectMember?.id) {
      toast.error("Please select a book and a member");
      return;
    }

    setIsIssueBookModalOpen(true);
  };

  return (
    <AppLayout title={"Issue Book"}>
      <div className="my-2 flex items-center justify-center gap-2">
        <Button onClick={onIssueBookClick} className="w-full sm:w-48">
          Issue Book
        </Button>
      </div>
      <div className="mt-2 flex w-full flex-col gap-6 xl:flex-row">
        <div className="w-full">
          <span className="text-lg font-medium">Select a member</span>
          <div className="mt-4">
            <MembersTable
              pageSize={10}
              columnVisibility={{ actions: false, joining_date: false }}
              showPagination={false}
              setTableInstance={setMemberTableInstance}
            />
          </div>
        </div>
        <Separator className="hidden xl:block" orientation="vertical" />
        <Separator className="block xl:hidden" orientation="horizontal" />
        <div className="w-full">
          <span className="text-lg font-medium">Select a book</span>
          <div className="mt-4">
            <BooksTable
              pageSize={10}
              columnVisibility={{
                actions: false,
                quantity: false,
                rent_fee: false,
                publication_date: false,
                average_rating: false,
              }}
              showPagination={false}
              setTableInstance={setBookTableInstance}
            />
          </div>
        </div>
      </div>
      <IssueBookModal />
    </AppLayout>
  );
};
