export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
