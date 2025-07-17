import { ResultMessages, ResultMessageKeys } from "./resultMessages";

export function makeResponse<T = any>(
  type: ResultMessageKeys,
  extra: Partial<{ data?: T; dataList?: T[]; [key: string]: any }> = {}
) {
  return {
    httpStatusCode: ResultMessages[type].code,
    message: ResultMessages[type].message,
    ...extra,
  };
}
