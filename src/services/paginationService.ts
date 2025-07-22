import { Model, Document, FilterQuery } from 'mongoose';
import { PaginationDTO, PaginatedResponseDTO } from '@/dto/pagination/pagination.dto';
import { encodeCursor, decodeCursor } from '@/utils/pagination/cursor';
import { generateETag } from '@/utils/pagination/etag';
import { ErrorResponseDTO } from '@/dto/ErrorResponse.dto';

interface PaginationParams {
  cursor?: string;
  offset?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, any>;
  page?: number;
}

export async function paginate<T extends Document>(
  model: Model<T>,
  params: PaginationParams
): Promise<PaginatedResponseDTO<T> | ErrorResponseDTO> {
  const {
    cursor,
    offset,
    limit = 5,
    sort = '_id',
    order = 'desc',
    filters = {},
    page = 1,
  } = params;

  let query: FilterQuery<T> = { ...(filters as FilterQuery<T>) };
  let skip = 0;
  let useCursor = !!cursor;
  let hasMore = false;
  let hasPrev = false;
  let totalCount = 0;
  let currentPage = page;
  let totalPages = 1;
  let nextCursor: string | undefined = undefined;
  let prevCursor: string | undefined = undefined;
  let isFirstPage = false;
  let isLastPage = false;
  let data: T[] = [];

  try {
    // Cursor-based pagination
    if (useCursor && cursor) {
      const decoded = decodeCursor(cursor);
      // For simplicity, assume sort is by _id or createdAt
      if (order === 'desc') {
        (query as any)[sort] = { $lt: decoded.id };
      } else {
        (query as any)[sort] = { $gt: decoded.id };
      }
    } else if (offset !== undefined) {
      skip = offset;
    } else {
      skip = (page - 1) * limit;
    }

    // Count total documents for pagination metadata
    totalCount = await model.countDocuments(filters as FilterQuery<T>);
    totalPages = Math.ceil(totalCount / limit) || 1;
    currentPage = useCursor ? page : Math.floor(skip / limit) + 1;

    // Fetch data
    data = await model
      .find(query)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit + 1) // Fetch one extra to check for hasMore
      .exec();

    if (data.length > limit) {
      hasMore = true;
      data = data.slice(0, limit);
    }
    hasPrev = skip > 0 || !!cursor;
    isFirstPage = currentPage === 1;
    isLastPage = !hasMore;

    // Cursors for next/prev
    if (data.length) {
      nextCursor = hasMore
        ? encodeCursor({ id: (data[data.length - 1] as any)[sort], sort, order, filters })
        : undefined;
      prevCursor = !isFirstPage
        ? encodeCursor({ id: (data[0] as any)[sort], sort, order, filters })
        : undefined;
    }

    // ETag and lastModified
    const etag = generateETag(
      data.map((item: any) => ({
        id: item._id?.toString?.() ?? item.id,
        title: item.title ?? '',
        updatedAt: item.updatedAt?.toISOString?.() ?? item.updatedAt ?? '',
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
      resultMessage: 'Pagination error',
      debugMessage: error.message,
      timestamp: Date.now(),
    });
  }
} 