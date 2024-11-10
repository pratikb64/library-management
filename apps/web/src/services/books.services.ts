import { BACKEND_URL } from "@/env";
import { ApiPaginatedResponse, ApiResponse, Book } from "@/types";

export interface GetBooksArgs {
  title?: string;
  author?: string;
  limit?: number;
  page?: number;
}

export const getBooksService = async (args?: GetBooksArgs) => {
  const url = new URL(`${BACKEND_URL}/api/books`);

  if (args?.title) url.searchParams.set("title", args.title);
  if (args?.author) url.searchParams.set("author", args.author);
  if (args?.page) url.searchParams.set("page", String(args.page));
  url.searchParams.set("limit", String(args?.limit || 100));

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  return data as ApiPaginatedResponse<Book[]>;
};

export const createBookService = async (book: Book) => {
  const response = await fetch(`${BACKEND_URL}/api/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  const data = await response.json();

  return data as ApiResponse<Book>;
};

export const deleteBookService = async (id: number) => {
  const response = await fetch(`${BACKEND_URL}/api/books/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  return data as ApiResponse<Book>;
};

export interface ImportBooksArgs {
  title?: string;
  no_of_books: number;
}

export const importBooksService = async (args: ImportBooksArgs) => {
  const response = await fetch(`${BACKEND_URL}/api/books/import`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });

  const data = await response.json();

  return data as ApiResponse<undefined>;
};

interface UpdateBookArgs {
  id: number;
  book: Partial<Book>;
}

export const updateBookService = async (args: UpdateBookArgs) => {
  const response = await fetch(`${BACKEND_URL}/api/books/${args.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args.book),
  });

  const data = await response.json();

  return data as ApiResponse<Book>;
};
