export interface UserRequest {
  id?: string;
  name: string;
  email: string;
  age: number;
  password: string;
  newPassword: string;
}

export interface UserResult {
  httpStatusCode: number;
  message: string;
  tokenCreated?: string;
  user?: Partial<UserRequest>;
}
