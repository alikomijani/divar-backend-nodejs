import type { PaginatedResponse } from '@/types/app.types';
import type { Model } from 'mongoose';

export async function getPaginatedQuery<T>(
  model: Model<T>,
  page: number | string | string[],
  pageSize: number | string | string[],
  query: object = {},
): Promise<PaginatedResponse<T>> {
  page = Number(page);
  pageSize = Number(pageSize);
  const total = await model.countDocuments(query);
  const results = await model
    .find(query)
    .skip((page - 1) * page) // Skip documents for pagination
    .limit(pageSize) // Limit the number of documents
    .lean(); // return object instead of full document object
  return {
    results,
    total,
    totalPages: Math.ceil(total / pageSize), // Total pages based on the limit
    page,
    pageSize,
  };
}
