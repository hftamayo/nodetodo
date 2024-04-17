export interface UserRequestBody {
  id: string;
  name: string;
  email: string;
  age: number;
  password: string;
  newPassword: string;
}

export interface UserRequestUpdateBody {
  id: string;
  name?: string;
  email?: string;
  age?: number;
  password?: string;
  newPassword?: string;
}

export interface UserId {
  id: string;
}

export interface RequestWithUserId extends Request {
  user: UserId;
}

export interface RequestWithUserBody extends Request {
  user: UserRequestBody;
}

export interface RequestWithUserUpdateBody extends Request {
  userId: UserId;
  user: UserRequestUpdateBody;
}

export interface UserControllerResult {
  httpStatusCode: number;
  tokenCreated: string;
  message: string;
  user: UserRequestBody;
}

export interface UserUpdateControllerResult {
  httpStatusCode: number;
  message: string;
  updatedUser: UserRequestBody;
}

export type PartialUserRequestBody = Partial<UserRequestBody>;
