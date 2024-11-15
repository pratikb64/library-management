import { Book } from "@/types";
import { createStore, useStore } from "zustand";

interface BooksPageState {
  isAddBookModalOpen: boolean;
  isImportBooksModalOpen: boolean;
  deleteBookData?: DeleteBookObj;
  editBookData?: EditBookObj;
}

interface BooksPageActions {
  setIsAddBookModalOpen: (isAddBookModalOpen: boolean) => void;
  setIsImportBooksModalOpen: (isImportBooksModalOpen: boolean) => void;
  setDeleteBookModalData: (args: DeleteBookObj) => void;
  setEditBookModalData: (args: EditBookObj) => void;
}

export type BooksPage = BooksPageState & BooksPageActions;

export const booksPageState = createStore<BooksPage>((set) => ({
  isAddBookModalOpen: false,
  isImportBooksModalOpen: false,
  setIsAddBookModalOpen: (isAddBookModalOpen) => set({ isAddBookModalOpen }),
  setIsImportBooksModalOpen: (isImportBooksModalOpen) =>
    set({ isImportBooksModalOpen }),
  setDeleteBookModalData: (args) => {
    set({ deleteBookData: args });
  },
  setEditBookModalData: (args) =>
    set({
      editBookData: args,
    }),
}));

export const useBooksPageState = () => useStore(booksPageState);

interface DeleteBookObj {
  isDeleteBookModalOpen: boolean;
  book?: Book;
}

interface EditBookObj {
  isEditBookModalOpen: boolean;
  book?: Book;
}
