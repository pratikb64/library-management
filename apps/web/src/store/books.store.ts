import {
  createBookService,
  deleteBookService,
  GetBooksArgs,
  getBooksService,
  ImportBooksArgs,
  importBooksService,
  updateBookService,
} from "@/services/books.services";
import { AsyncState, Book } from "@/types";
import { createStore, useStore } from "zustand";

interface BooksState {
  books: Book[];
  asyncStates: {
    fetchBooksAsyncState: AsyncState;
    createBookAsyncState: AsyncState;
    deleteBookAsyncState: AsyncState;
    importBooksAsyncState: AsyncState;
    updateBookAsyncState: AsyncState;
  };
}

interface BooksActions {
  fetchBooks: (args?: GetBooksArgs) => Promise<void>;
  createBook: (book: Book) => Promise<void>;
  deleteBook: (id: number) => Promise<void>;
  importBooks: (args: ImportBooksArgs) => Promise<void>;
  updateBook: (id: number, book: Partial<Book>) => Promise<void>;
}

export type BooksStore = BooksState & BooksActions;

export const booksStore = createStore<BooksStore>((set, get) => ({
  books: [],
  asyncStates: {
    fetchBooksAsyncState: AsyncState.Idle,
    createBookAsyncState: AsyncState.Idle,
    deleteBookAsyncState: AsyncState.Idle,
    importBooksAsyncState: AsyncState.Idle,
    updateBookAsyncState: AsyncState.Idle,
  },
  fetchBooks: async (args) => {
    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        fetchBooksAsyncState: AsyncState.Pending,
      },
      books: [],
    }));

    const books = await getBooksService(args)
      .then((res) => res)
      .catch(() => null);

    if (!books) {
      set((state) => ({
        books: [],
        asyncStates: {
          ...state.asyncStates,
          fetchBooksAsyncState: AsyncState.Error,
        },
      }));
      return Promise.reject();
    }

    set({ books: books.data });

    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        fetchBooksAsyncState: AsyncState.Success,
      },
    }));
  },
  createBook: async (book) => {
    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        createBookAsyncState: AsyncState.Pending,
      },
    }));

    // Create book
    const createdBook = await createBookService(book)
      .then((res) => res)
      .catch(() => null);

    if (!createdBook) {
      set((state) => ({
        asyncStates: {
          ...state.asyncStates,
          createBookAsyncState: AsyncState.Error,
        },
      }));
      return Promise.reject();
    }

    // Add created book to state
    set((state) => ({
      books: [...state.books, createdBook.data],
      asyncStates: {
        ...state.asyncStates,
        createBookAsyncState: AsyncState.Success,
      },
    }));
  },
  deleteBook: async (id) => {
    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        deleteBookAsyncState: AsyncState.Pending,
      },
    }));

    const isDeleted = await deleteBookService(id)
      .then((res) => res)
      .catch(() => null);

    if (!isDeleted) {
      set((state) => ({
        asyncStates: {
          ...state.asyncStates,
          deleteBookAsyncState: AsyncState.Error,
        },
      }));
      return Promise.reject();
    }

    set((state) => ({
      books: state.books.filter((book) => book.id !== id),
      asyncStates: {
        ...state.asyncStates,
        deleteBookAsyncState: AsyncState.Success,
      },
    }));
  },
  importBooks: async (args) => {
    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        importBooksAsyncState: AsyncState.Pending,
      },
    }));

    const isDataImported = await importBooksService(args)
      .then((res) => res)
      .catch(() => null);

    if (!isDataImported) {
      set((state) => ({
        asyncStates: {
          ...state.asyncStates,
          importBooksAsyncState: AsyncState.Error,
        },
      }));
      return Promise.reject();
    }

    await get().fetchBooks();

    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        importBooksAsyncState: AsyncState.Success,
      },
    }));
  },
  updateBook: async (id, book) => {
    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        updateBookAsyncState: AsyncState.Pending,
      },
    }));

    // Update book
    const updatedBook = await updateBookService({ id, book })
      .then((res) => res)
      .catch(() => null);

    if (!updatedBook) {
      set((state) => ({
        asyncStates: {
          ...state.asyncStates,
          updateBookAsyncState: AsyncState.Error,
        },
      }));
      return Promise.reject();
    }

    // Update book in state
    set((state) => ({
      books: state.books.map((b) => (b.id === id ? updatedBook.data : b)),
      asyncStates: {
        ...state.asyncStates,
        updateBookAsyncState: AsyncState.Success,
      },
    }));
  },
}));

export const useBooksStore = () => useStore(booksStore);
