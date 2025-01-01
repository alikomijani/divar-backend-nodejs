import type {
  BufferToBinary,
  Default__v,
  FlattenMaps,
  Require_id,
} from 'mongoose';

export interface PaginatedResponse<T> {
  results: Default__v<Require_id<BufferToBinary<FlattenMaps<T>>>>[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
