export interface UserRequestBody {
  id?: string;
  name: string;
  email: string;
  age: number;
  password: string;
  newPassword: string;
}

export interface UpdateUserParams {
  user: Partial<UserRequestBody>;
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
