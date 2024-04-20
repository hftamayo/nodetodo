export interface UserRequestBody {
  name: string;
  email: string;
  age: number;
  password: string;
  newPassword: string;
}

export interface UserRequestBodyWithId extends UserRequestBody {
  id?: string;
}

export interface UpdateUserDetailsParams {
  user: UserRequestBodyWithId;
}

export interface UpdateUserPasswordParams {
  user: Partial<UserRequestBodyWithId>;
}

export interface RequestWithUserId extends Request {
  id: Partial<UserRequestBodyWithId>;
}

export interface RequestWitUserBody extends Request {
  user: Partial<UserRequestBody>;
}

export interface UserControllerResult {
  httpStatusCode: number;
  message: string;
  tokenCreated?: string;
  user?: Partial<UserRequestBody>;
}
