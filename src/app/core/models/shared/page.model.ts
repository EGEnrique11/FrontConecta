export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;

  page?: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  }
}