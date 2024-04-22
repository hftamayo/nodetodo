export interface UserRequest {
  id?: string;
  name: string;
  email: string;
  age: number;
  password: string;
  newPassword: string;
}

export interface UpdateUserRequest extends Partial<UserRequest> {
  userId: string;
  user: Partial<UserRequest>;
}

export interface UserIdRequest {
  userId: string;
}

export interface UserResult {
  httpStatusCode: number;
  message: string;
  tokenCreated?: string;
  user?: Partial<UserRequest>;
}
