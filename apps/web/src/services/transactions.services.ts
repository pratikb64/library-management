import { BACKEND_URL } from "@/env";
import {
  ApiPaginatedResponse,
  ApiResponse,
  Transaction,
  TransactionStatus,
} from "@/types";

export interface GetTransactionsArgs {
  member_first_name?: string;
  member_last_name?: string;
  member_id?: number;
  book_title?: string;
  book_id?: number;
  status?: TransactionStatus;
  limit?: number;
  page?: number;
}

export const getTransactionsService = async (args?: GetTransactionsArgs) => {
  const url = new URL(`${BACKEND_URL}/api/transactions`);

  if (args?.member_first_name)
    url.searchParams.set("member_first_name", args.member_first_name);
  if (args?.member_last_name)
    url.searchParams.set("member_last_name", args.member_last_name);
  if (args?.member_id)
    url.searchParams.set("member_id", String(args.member_id));
  if (args?.book_title) url.searchParams.set("book_title", args.book_title);
  if (args?.book_id) url.searchParams.set("book_id", String(args.book_id));
  if (args?.page) url.searchParams.set("page", String(args.page));
  if (args?.status) url.searchParams.set("status", args.status);

  url.searchParams.set("limit", String(args?.limit || 50));

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return Promise.reject();
  }

  const data = await response.json();

  return data as ApiPaginatedResponse<Transaction[]>;
};

export const createTransactionService = async (
  transaction: Omit<Transaction, "id" | "joining_date">,
) => {
  const response = await fetch(`${BACKEND_URL}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    return Promise.reject();
  }

  const data = await response.json();

  return data as ApiResponse<Transaction>;
};

export const deleteTransactionService = async (id: number) => {
  const response = await fetch(`${BACKEND_URL}/api/transactions/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return Promise.reject();
  }

  const data = await response.json();

  return data as ApiResponse<Transaction>;
};

interface UpdateTransactionArgs {
  id: number;
  transaction: Partial<Transaction>;
}

export const updateTransactionService = async (args: UpdateTransactionArgs) => {
  const response = await fetch(`${BACKEND_URL}/api/transactions/${args.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args.transaction),
  });

  if (!response.ok) {
    return Promise.reject();
  }

  const data = await response.json();

  return data as ApiResponse<Transaction>;
};
