import { ResultMessageType } from './resultMessageType.enum';

export class CrudOperationResponseDto<T = any> {
  code: number;
  resultMessage: ResultMessageType;
  data?: T;
  dataList?: T[];
  timestamp: number;
  cacheTTL: number;

  constructor(options: {
    code: number;
    resultMessage: ResultMessageType;
    data?: T;
    dataList?: T[];
    timestamp?: number;
    cacheTTL?: number;
  }) {
    this.code = options.code;
    this.resultMessage = options.resultMessage;
    this.data = options.data;
    this.dataList = options.dataList;
    this.timestamp = options.timestamp ?? Date.now();
    this.cacheTTL = options.cacheTTL ?? 0;
  }
} 