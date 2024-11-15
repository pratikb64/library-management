import { Book, Member } from "@/types";
import { Table } from "@tanstack/react-table";
import { createStore, useStore } from "zustand";

interface IssueBooksPageState {
  isIssueBookModalOpen: boolean;
  memberTableInstance?: Table<Member> | undefined;
  bookTableInstance?: Table<Book> | undefined;
}

interface IssueBooksPageActions {
  setIsIssueBookModalOpen: (isIssueBookModalOpen: boolean) => void;
  setMemberTableInstance: (
    memberTableInstance: Table<Member> | undefined,
  ) => void;
  setBookTableInstance: (bookTableInstance: Table<Book> | undefined) => void;
}

export type IssueBooksPage = IssueBooksPageState & IssueBooksPageActions;

export const IssueBooksPageState = createStore<IssueBooksPage>((set) => ({
  isIssueBookModalOpen: false,
  setIsIssueBookModalOpen: (isIssueBookModalOpen: boolean) => {
    set({ isIssueBookModalOpen });
  },
  setMemberTableInstance: (memberTableInstance: Table<Member> | undefined) => {
    set({ memberTableInstance });
  },
  setBookTableInstance: (bookTableInstance: Table<Book> | undefined) => {
    set({ bookTableInstance });
  },
}));

export const useIssueBooksPageState = () => useStore(IssueBooksPageState);
