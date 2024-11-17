import {
  createTransactionService,
  deleteTransactionService,
  GetTransactionsArgs,
  getTransactionsService,
  updateTransactionService,
} from "@/services/transactions.services";
import { AsyncState, Transaction } from "@/types";
import { createStore, useStore } from "zustand";

interface TransactionsState {
  transactions: Transaction[];
  asyncStates: {
    fetchTransactionsAsyncState: AsyncState;
    createTransactionAsyncState: AsyncState;
    deleteTransactionAsyncState: AsyncState;
    updateTransactionAsyncState: AsyncState;
  };
}

interface TransactionsActions {
  fetchTransactions: (args?: GetTransactionsArgs) => Promise<void>;
  createTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  updateTransaction: (
    id: number,
    transaction: Partial<Omit<Transaction, "book" | "member">>,
  ) => Promise<void>;
}

export type TransactionsStore = TransactionsState & TransactionsActions;

export const transactionsStore = createStore<TransactionsStore>((set) => ({
  transactions: [],
  asyncStates: {
    fetchTransactionsAsyncState: AsyncState.Idle,
    createTransactionAsyncState: AsyncState.Idle,
    deleteTransactionAsyncState: AsyncState.Idle,
    updateTransactionAsyncState: AsyncState.Idle,
  },
  fetchTransactions: async (args) => {
    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        fetchTransactionsAsyncState: AsyncState.Pending,
      },
      transactions: [],
    }));

    const transactions = await getTransactionsService(args)
      .then((res) => res)
      .catch(() => null);

    if (!transactions) {
      set((state) => ({
        transactions: [],
        asyncStates: {
          ...state.asyncStates,
          fetchTransactionsAsyncState: AsyncState.Error,
        },
      }));
      return Promise.reject();
    }

    set({ transactions: transactions.data });

    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        fetchTransactionsAsyncState: AsyncState.Success,
      },
    }));
  },
  createTransaction: async (transaction) => {
    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        createTransactionAsyncState: AsyncState.Pending,
      },
    }));

    // Create transaction
    const createdTransaction = await createTransactionService(transaction)
      .then((res) => res)
      .catch(() => null);

    if (!createdTransaction) {
      set((state) => ({
        asyncStates: {
          ...state.asyncStates,
          createTransactionAsyncState: AsyncState.Error,
        },
      }));
      return Promise.reject();
    }

    // Add created transaction to state
    set((state) => ({
      transactions: [...state.transactions, createdTransaction.data],
      asyncStates: {
        ...state.asyncStates,
        createTransactionAsyncState: AsyncState.Success,
      },
    }));
  },
  deleteTransaction: async (id) => {
    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        deleteTransactionAsyncState: AsyncState.Pending,
      },
    }));

    const isDeleted = await deleteTransactionService(id)
      .then((res) => res)
      .catch(() => null);

    if (!isDeleted) {
      set((state) => ({
        asyncStates: {
          ...state.asyncStates,
          deleteTransactionAsyncState: AsyncState.Error,
        },
      }));
      return Promise.reject();
    }

    set((state) => ({
      transactions: state.transactions.filter(
        (transaction) => transaction.id !== id,
      ),
      asyncStates: {
        ...state.asyncStates,
        deleteTransactionAsyncState: AsyncState.Success,
      },
    }));
  },
  updateTransaction: async (id, transaction) => {
    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        updateTransactionAsyncState: AsyncState.Pending,
      },
    }));

    // Update transaction
    const updatedTransaction = await updateTransactionService({
      id,
      transaction: transaction,
    })
      .then((res) => res)
      .catch(() => null);

    if (!updatedTransaction) {
      set((state) => ({
        asyncStates: {
          ...state.asyncStates,
          updateTransactionAsyncState: AsyncState.Error,
        },
      }));
      return Promise.reject();
    }

    // Update transaction in state
    set((state) => ({
      transactions: state.transactions.map((b) =>
        b.id === id ? updatedTransaction.data : b,
      ),
      asyncStates: {
        ...state.asyncStates,
        updateTransactionAsyncState: AsyncState.Success,
      },
    }));
  },
}));

export const useTransactionsStore = () => useStore(transactionsStore);
