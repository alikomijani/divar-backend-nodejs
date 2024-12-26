import type { Model } from 'mongoose';

export async function getPaginatedQuery<T>(
  model: Model<T>,
  page = 1,
  pageSize = 10,
  query: object,
) {
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
