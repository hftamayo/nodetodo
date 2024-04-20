export interface UserRequest {
  id?: string;
  name: string;
  email: string;
  age: number;
  password: string;
  newPassword: string;
}

export interface PartialUserRequest extends Partial<UserRequest> {
  user: Partial<UserRequest>;
}

export interface UserResult {
  httpStatusCode: number;
  message: string;
  tokenCreated?: string;
  user?: Partial<UserRequest>;
}
