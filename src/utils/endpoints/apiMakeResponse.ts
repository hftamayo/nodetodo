import { EndpointResponseDto } from "@/api/v1/dto/EndpointResponse.dto";
import { ErrorResponseDTO } from "@/api/v1/dto/error/ErrorResponse.dto";

// Success response utility with generic envelope
export function successResponse<T>(
  data?: T,
  dataList?: T[],
  code: number = 200,
  message: string = "OPERATION_SUCCESS",
  cacheTTL: number = 0
): EndpointResponseDto<T> {
  return new EndpointResponseDto({
    code,
    resultMessage: message,
    data,
    dataList,
    cacheTTL,
  });
}

// Error response utility
export function errorResponse(
  code: number,
  message: string,
  debugMessage?: string,
  cacheTTL: number = 0
): ErrorResponseDTO {
  return new ErrorResponseDTO({
    code,
    resultMessage: message,
    debugMessage,
    cacheTTL,
  });
}

// Legacy makeResponse function for backward compatibility
export function makeResponse(type: string, data?: any): any {
  // This maintains backward compatibility with existing services
  // but should be gradually replaced with successResponse/errorResponse
  switch (type) {
    case "SUCCESS":
      return successResponse(
        data?.data,
        data?.dataList,
        200,
        "OPERATION_SUCCESS"
      );
    case "CREATED":
      return successResponse(data?.data, undefined, 201, "ENTITY_CREATED");
    case "ERROR":
      return errorResponse(404, "NOT_FOUND");
    case "BAD_REQUEST":
      return errorResponse(400, "BAD_REQUEST");
    case "UNAUTHORIZED":
      return errorResponse(401, "UNAUTHORIZED");
    case "FORBIDDEN":
      return errorResponse(403, "FORBIDDEN");
    case "ENTITY_ALREADY_EXISTS":
      return errorResponse(409, "ENTITY_ALREADY_EXISTS");
    case "INTERNAL_SERVER_ERROR":
      return errorResponse(500, "INTERNAL_SERVER_ERROR");
    default:
      return errorResponse(500, "UNKNOWN_ERROR");
  }
}
