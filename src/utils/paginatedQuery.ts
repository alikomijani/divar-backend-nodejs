import type { PaginatedResponse } from '@/types/app.types';
import type { Model } from 'mongoose';

export async function getPaginatedQuery<T>(
  model: Model<T>,
  page: number | string | string[],
  pageSize: number | string | string[],
  query: object,
): Promise<PaginatedResponse<T>> {
  page = Number(page);
  pageSize = Number(pageSize);
  const total = await model.countDocuments();
  const results = await model
    .find(query)
    .skip((page - 1) * page) // Skip documents for pagination
    .limit(pageSize); // Limit the number of documents
  return {
    results,
    total,
    totalPages: Math.ceil(total / pageSize), // Total pages based on the limit
    page,
    pageSize,
  };
}
