export interface UserRequestBody {
  id: string;
  name: string;
  email: string;
  age: number;
  password: string;
  newPassword: string;
}

export interface UserId {
  id: string;
}

export interface RequestWithUserId extends Request {
  user: UserId;
}

export interface RequestWithUser extends Request {
  user: UserRequestBody;
}

export interface UserControllerResult {
  httpStatusCode: number;
  tokenCreated: string;
  message: string;
  user: UserRequestBody;
}

export type PartialUserRequestBody = Partial<UserRequestBody>;
