export interface Book {
  id: number;
  title: string;
  authors: string;
  average_rating: number;
  isbn: number;
  isbn13: number;
  language_code: string;
  num_pages: number;
  ratings_count: number;
  text_reviews_count: number;
  publication_date: string;
  publisher: string;
  rent_fee: number;
}

export interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  joining_date: string;
}

export enum TransactionStatus {
  ISSUED = "issued",
  RETURNED = "returned",
}

export interface Transaction {
  id: number;
  book: Book;
  member: Member;
  issue_date: string;
  return_date: string | null;
  status: TransactionStatus;
  fee_charged: number;
}

//
export enum AsyncState {
  Idle = "idle",
  Pending = "pending",
  Success = "success",
  Error = "error",
}

export interface ApiPaginatedResponse<T> {
  success: boolean;
  message: string;
  total_count: number;
  limit: number;
  page: number;
  data: T;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}
