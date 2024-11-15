import { IssueBookArgs, issueBookService } from "@/services/books.services";
import { AsyncState, Book, Member } from "@/types";
import { Table } from "@tanstack/react-table";
import { createStore, useStore } from "zustand";

interface IssueBooksPageState {
  isIssueBookModalOpen: boolean;
  memberTableInstance?: Table<Member> | undefined;
  bookTableInstance?: Table<Book> | undefined;
  asyncStates: {
    issueBookAsyncState: AsyncState;
  };
  issueBookAsyncErrMessage?: string;
}

interface IssueBooksPageActions {
  setIsIssueBookModalOpen: (isIssueBookModalOpen: boolean) => void;
  setMemberTableInstance: (
    memberTableInstance: Table<Member> | undefined,
  ) => void;
  setBookTableInstance: (bookTableInstance: Table<Book> | undefined) => void;
  issueBook: (args: IssueBookArgs) => Promise<void>;
  setIssueBookAsyncErrMessage: (issueBookAsyncErrMessage: string) => void;
}

export type IssueBooksPage = IssueBooksPageState & IssueBooksPageActions;

export const IssueBooksPageState = createStore<IssueBooksPage>((set) => ({
  isIssueBookModalOpen: false,
  asyncStates: {
    issueBookAsyncState: AsyncState.Idle,
  },
  setIsIssueBookModalOpen: (isIssueBookModalOpen: boolean) => {
    set({ isIssueBookModalOpen });
  },
  setMemberTableInstance: (memberTableInstance: Table<Member> | undefined) => {
    set({ memberTableInstance });
  },
  setBookTableInstance: (bookTableInstance: Table<Book> | undefined) => {
    set({ bookTableInstance });
  },
  setIssueBookAsyncErrMessage: (issueBookAsyncErrMessage: string) => {
    set({ issueBookAsyncErrMessage });
  },
  issueBook: async (args) => {
    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        issueBookAsyncState: AsyncState.Pending,
      },
    }));

    const isBookIssued = await issueBookService(args)
      .then((res) => res)
      .catch((er: number) => er);

    if (typeof isBookIssued === "number" && isBookIssued == 406) {
      set((state) => ({
        asyncStates: {
          ...state.asyncStates,
          issueBookAsyncState: AsyncState.Error,
        },
        issueBookAsyncErrMessage:
          "Member's pending fee exceeds the Rs. 500 limit",
      }));
      return Promise.reject();
    }

    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        issueBookAsyncState: AsyncState.Success,
      },
    }));
  },
}));

export const useIssueBooksPageState = () => useStore(IssueBooksPageState);
