import { BooksTable } from "../books/components/BooksTable";
import { MembersTable } from "../members/components/MembersTable";
import { IssueBookModal } from "./components/IssueBookModal";
import { useIssueBooksPageState } from "./issue-book-page.state";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const IssueBook = () => {
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
      <div className="my-2 flex items-center gap-2">
        <Button onClick={onIssueBookClick}>Issue Book</Button>
      </div>
      <Separator className="mb-2" />
      <div>
        <span className="text-lg font-medium">Select a member</span>
        <div className="mt-4">
          <MembersTable
            pageSize={5}
            columnVisibility={{ actions: false }}
            showPagination={false}
            setTableInstance={setMemberTableInstance}
          />
        </div>
      </div>
      <Separator className="my-4" />
      <div>
        <span className="text-lg font-medium">Select a book</span>
        <div className="mt-4">
          <BooksTable
            pageSize={5}
            columnVisibility={{ actions: false }}
            showPagination={false}
            setTableInstance={setBookTableInstance}
          />
        </div>
      </div>
      <IssueBookModal />
    </AppLayout>
  );
};
