import { ResultMessages, ResultMessageKeys } from "@/utils/messages/resultMessages";

export class CrudOperationResponseDto<T = any> {
  code: number;
  resultMessage: string;
  data?: T;
  dataList?: T[];
  timestamp: number;
  cacheTTL: number;

  constructor(options: {
    code: number;
    resultMessage: string;
    data?: T;
    dataList?: T[];
    timestamp?: number;
    cacheTTL?: number;
  }) {
    const { code, resultMessage, data, dataList, timestamp, cacheTTL } = options;
    this.code = code;
    this.resultMessage = resultMessage;
    this.data = data;
    this.dataList = dataList;
    this.timestamp = timestamp ?? Date.now();
    this.cacheTTL = cacheTTL ?? 0;
  }
}
