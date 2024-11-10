import { useBooksPageState } from "../books-page.state";
import { Button } from "@/components/ui/button";

export const BooksPageActions = () => {
  const { setIsAddBookModalOpen, setIsImportBooksModalOpen } =
    useBooksPageState();
  return (
    <div className="flex gap-2">
      <Button onClick={() => setIsAddBookModalOpen(true)}>Add book</Button>
      <Button variant="outline" onClick={() => setIsImportBooksModalOpen(true)}>
        Import books
      </Button>
    </div>
  );
};
