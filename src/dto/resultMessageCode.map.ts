import { ResultMessageType } from './resultMessageType.enum';

export const ResultMessageCodeMap: Record<ResultMessageType, number> = {
  [ResultMessageType.OPERATION_SUCCESS]: 200,
  [ResultMessageType.NOT_FOUND]: 404,
  [ResultMessageType.BAD_REQUEST]: 400,
  [ResultMessageType.CREATED]: 201,
  // Add more as needed
}; 