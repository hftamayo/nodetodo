import { ResultMessages, ResultMessageKeys } from "@/utils/messages/resultMessages";

export class CrudOperationResponseDto<T = any> {
  code: number;
  resultMessage: string;
  data?: T;
  dataList?: T[];
  timestamp: number;
  cacheTTL: number;

  constructor(options: {
    resultType: ResultMessageKeys;
    data?: T;
    dataList?: T[];
    timestamp?: number;
    cacheTTL?: number;
  }) {
    const { resultType, data, dataList, timestamp, cacheTTL } = options;
    this.code = ResultMessages[resultType].code;
    this.resultMessage = ResultMessages[resultType].message;
    this.data = data;
    this.dataList = dataList;
    this.timestamp = timestamp ?? Date.now();
    this.cacheTTL = cacheTTL ?? 0;
  }
}
