export enum AsyncState {
  Idle = "idle",
  Pending = "pending",
  Success = "success",
  Error = "error",
}

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
