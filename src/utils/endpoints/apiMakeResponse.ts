import { EndpointResponseDto } from "@/dto/EndpointResponse.dto";
import { ErrorResponseDTO } from "@/dto/error/ErrorResponse.dto";

// Success response utility
export function buildSuccessResponse<T>(
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
export function buildErrorResponse(
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
  // but should be gradually replaced with buildSuccessResponse/buildErrorResponse
  switch (type) {
    case "SUCCESS":
      return buildSuccessResponse(
        data?.data,
        data?.dataList,
        200,
        "OPERATION_SUCCESS"
      );
    case "CREATED":
      return buildSuccessResponse(data?.data, undefined, 201, "ENTITY_CREATED");
    case "BAD_REQUEST":
      return buildErrorResponse(400, "BAD_REQUEST");
    case "ENTITY_ALREADY_EXISTS":
      return buildErrorResponse(400, "ENTITY_ALREADY_EXISTS");
    case "UNAUTHORIZED":
      return buildErrorResponse(401, "UNAUTHORIZED");
    case "BAD_CREDENTIALS":
      return buildErrorResponse(402, "BAD_CREDENTIALS");
    case "FORBIDDEN":
      return buildErrorResponse(403, "FORBIDDEN");
    case "ERROR":
      return buildErrorResponse(404, "NOT_FOUND");
    case "ACCOUNT_DISABLED":
      return buildErrorResponse(405, "ACCOUNT_DISABLED");
    case "INTERNAL_SERVER_ERROR":
      return buildErrorResponse(500, "UNKNOWN_SERVER_ERROR");
    default:
      return buildErrorResponse(500, "UNKNOWN_ERROR");
  }
}
