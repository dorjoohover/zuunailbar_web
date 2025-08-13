import { DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_SORT } from "@/lib/const";

export interface Pagination {
  limit?: number;
  page?: number;
  sort?: boolean;
  [filter: string]: any;
}

export const defaultPagination: Pagination = {
  limit: DEFAULT_LIMIT,
  page: DEFAULT_PAGE,
  sort: DEFAULT_SORT,
};
