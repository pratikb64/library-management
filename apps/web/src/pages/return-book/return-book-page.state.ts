import { Transaction } from "@/types";
import { Table } from "@tanstack/react-table";
import { createStore, useStore } from "zustand";

interface ReturnBooksPageState {
  isReturnBookModalOpen: boolean;
  transactionTableInstance?: Table<Transaction> | undefined;
}

interface ReturnBooksPageActions {
  setIsReturnBookModalOpen: (isReturnBookModalOpen: boolean) => void;
  setTransactionTableInstance: (
    memberTableInstance: Table<Transaction> | undefined,
  ) => void;
}

export type ReturnBooksPage = ReturnBooksPageState & ReturnBooksPageActions;

export const ReturnBooksPageState = createStore<ReturnBooksPage>((set) => ({
  isReturnBookModalOpen: false,

  setIsReturnBookModalOpen: (isReturnBookModalOpen: boolean) => {
    set({ isReturnBookModalOpen });
  },
  setTransactionTableInstance: (
    transactionTableInstance: Table<Transaction> | undefined,
  ) => {
    set({ transactionTableInstance });
  },
}));

export const useReturnBooksPageState = () => useStore(ReturnBooksPageState);
