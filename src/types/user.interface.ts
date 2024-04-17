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

export interface UserRequestPassword {
  id: string;
  password: string;
  newPassword: string;
}

export interface UserId {
  id: string;
}

export interface UpdateUserDetailsParams {
  userId: string;
  user: UserRequestUpdateBody;
}

export interface UpdateUserPasswordParams {
  userId: string;
  user: UserRequestPassword;

}

export interface RequestWithUserId extends Request {
  user: UserId;
}

export interface RequestWithUserBody extends Request {
  user: UserRequestBody;
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
  user: UserRequestBody;
}

export type PartialUserRequestBody = Partial<UserRequestBody>;
