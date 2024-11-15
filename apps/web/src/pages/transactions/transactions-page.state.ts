import { Transaction } from "@/types";
import { createStore, useStore } from "zustand";

interface TransactionsPageState {
  editTransactionData?: EditTransactionObj;
  deleteTransactionData?: DeleteTransactionObj;
}

interface TransactionsPageActions {
  setEditTransactionModalData: (args: EditTransactionObj) => void;
  setDeleteTransactionModalData: (args: DeleteTransactionObj) => void;
}

export type TransactionsPage = TransactionsPageState & TransactionsPageActions;

export const transactionsPageState = createStore<TransactionsPage>((set) => ({
  setEditTransactionModalData: (args) =>
    set({
      editTransactionData: args,
    }),
  setDeleteTransactionModalData: (args) => {
    set({ deleteTransactionData: args });
  },
}));

export const useTransactionsPageState = () => useStore(transactionsPageState);

interface DeleteTransactionObj {
  isDeleteTransactionModalOpen: boolean;
  transaction?: Transaction;
}

interface EditTransactionObj {
  isEditTransactionModalOpen: boolean;
  transaction?: Transaction;
}
