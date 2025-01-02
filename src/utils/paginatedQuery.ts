import type { PaginatedResponse } from '@/types/app.types';
import type { Model, Document } from 'mongoose';
import type { PopulateOptions } from 'mongoose';

type PaginatedQueryOptions = {
  page: number | string | string[];
  pageSize: number | string | string[];
  query?: object;
  populateOptions?: PopulateOptions[];
};
export async function getPaginatedQuery<T extends Document>(
  model: Model<T>,
  { page, pageSize, query = {}, populateOptions }: PaginatedQueryOptions,
): Promise<PaginatedResponse<T>> {
  page = Number(page);
  pageSize = Number(pageSize);
  const total = await model.countDocuments(query);
  const resultsQuery = model
    .find(query)
    .select('-__v')
    .skip((page - 1) * pageSize)
    .limit(pageSize);
  if (populateOptions) {
    resultsQuery.populate(populateOptions);
  }
  const results = await resultsQuery.exec();

  return {
    results,
    total,
    totalPages: Math.ceil(total / pageSize),
    page,
    pageSize,
  };
}
