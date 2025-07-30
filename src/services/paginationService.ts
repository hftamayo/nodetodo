import { Model, Document, FilterQuery } from "mongoose";
import {
  PaginationDTO,
  PaginatedResponseDTO,
} from "@/dto/pagination/pagination.dto";
import { encodeCursor, decodeCursor } from "@/utils/pagination/cursor";
import { generateETag } from "@/utils/pagination/etag";
import { ErrorResponseDTO } from "@/dto/error/ErrorResponse.dto";

interface PaginationParams {
  cursor?: string;
  offset?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  filters?: Record<string, any>;
  page?: number;
}

interface PaginationState {
  query: FilterQuery<any>;
  skip: number;
  useCursor: boolean;
  currentPage: number;
  totalCount: number;
  totalPages: number;
}

function buildQuery<T extends Document>(
  params: PaginationParams,
  filters: Record<string, any>
): PaginationState {
  const { cursor, offset, limit = 5, sort = "_id", order = "desc", page = 1 } = params;
  
  let query: FilterQuery<T> = { ...(filters as FilterQuery<T>) };
  let skip = 0;
  let useCursor = !!cursor;
  let currentPage = page;

  // Cursor-based pagination
  if (useCursor && cursor) {
    const decoded = decodeCursor(cursor);
    if (order === "desc") {
      (query as any)[sort] = { $lt: decoded.id };
    } else {
      (query as any)[sort] = { $gt: decoded.id };
    }
  } else if (offset !== undefined) {
    skip = offset;
  } else {
    skip = (page - 1) * limit;
  }

  return { query, skip, useCursor, currentPage, totalCount: 0, totalPages: 1 };
}

async function calculatePaginationMetadata<T extends Document>(
  model: Model<T>,
  filters: Record<string, any>,
  limit: number,
  skip: number,
  useCursor: boolean,
  currentPage: number
): Promise<{ totalCount: number; totalPages: number; currentPage: number }> {
  const totalCount = await model.countDocuments(filters as FilterQuery<T>);
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const calculatedCurrentPage = useCursor ? currentPage : Math.floor(skip / limit) + 1;
  
  return { totalCount, totalPages, currentPage: calculatedCurrentPage };
}

function fetchData<T extends Document>(
  model: Model<T>,
  query: FilterQuery<T>,
  sort: string,
  order: "asc" | "desc",
  skip: number,
  limit: number
): Promise<T[]> {
  return model
    .find(query)
    .sort({ [sort]: order === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit + 1) // Fetch one extra to check for hasMore
    .exec();
}

function processPaginationResults<T>(
  data: T[],
  limit: number,
  skip: number,
  currentPage: number
): { data: T[]; hasMore: boolean; hasPrev: boolean; isFirstPage: boolean; isLastPage: boolean } {
  let hasMore = false;
  
  if (data.length > limit) {
    hasMore = true;
    data = data.slice(0, limit);
  }
  
  const hasPrev = skip > 0;
  const isFirstPage = currentPage === 1;
  const isLastPage = !hasMore;
  
  return { data, hasMore, hasPrev, isFirstPage, isLastPage };
}

function generateCursors(
  data: any[],
  hasMore: boolean,
  isFirstPage: boolean,
  sort: string,
  order: "asc" | "desc",
  filters: Record<string, any>
): { nextCursor?: string; prevCursor?: string } {
  if (!data.length) {
    return { nextCursor: undefined, prevCursor: undefined };
  }
  
  const nextCursor = hasMore
    ? encodeCursor({
        id: data[data.length - 1][sort],
        sort,
        order,
        filters,
      })
    : undefined;
    
  const prevCursor = !isFirstPage
    ? encodeCursor({ id: data[0][sort], sort, order, filters })
    : undefined;
    
  return { nextCursor, prevCursor };
}

function generateCacheHeaders(data: any[]): { etag: string; lastModified?: string } {
  const etag = generateETag(
    data.map((item: any) => ({
      id: item._id?.toString?.() ?? item.id,
      title: item.title ?? "",
      updatedAt: item.updatedAt?.toISOString?.() ?? item.updatedAt ?? "",
    }))
  );
  
  const lastModified = data.length
    ? new Date(
        Math.max(
          ...data.map((item: any) =>
            new Date(item.updatedAt ?? item.createdAt ?? Date.now()).getTime()
          )
        )
      ).toUTCString()
    : undefined;
    
  return { etag, lastModified };
}

export async function paginate<T extends Document>(
  model: Model<T>,
  params: PaginationParams
): Promise<PaginatedResponseDTO<T> | ErrorResponseDTO> {
  const { limit = 5, sort = "_id", order = "desc", filters = {} } = params;

  try {
    // Build query and initial state
    const state = buildQuery(params, filters);
    
    // Calculate pagination metadata
    const { totalCount, totalPages, currentPage } = await calculatePaginationMetadata(
      model,
      filters,
      limit,
      state.skip,
      state.useCursor,
      state.currentPage
    );
    
    // Fetch data
    const rawData = await fetchData(model, state.query, sort, order, state.skip, limit);
    
    // Process results
    const { data, hasMore, hasPrev, isFirstPage, isLastPage } = processPaginationResults(
      rawData,
      limit,
      state.skip,
      currentPage
    );
    
    // Generate cursors
    const { nextCursor, prevCursor } = generateCursors(
      data,
      hasMore,
      isFirstPage,
      sort,
      order,
      filters
    );
    
    // Generate cache headers
    const { etag, lastModified } = generateCacheHeaders(data);

    const pagination = new PaginationDTO({
      nextCursor,
      prevCursor,
      limit,
      totalCount,
      hasMore,
      currentPage,
      totalPages,
      order,
      hasPrev,
      isFirstPage,
      isLastPage,
    });

    return new PaginatedResponseDTO<T>({
      data,
      pagination,
      etag,
      lastModified,
    });
  } catch (error: any) {
    return new ErrorResponseDTO({
      code: 500,
      resultMessage: "Pagination error",
      debugMessage: error.message,
      timestamp: Date.now(),
    });
  }
}
