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
  id: string;
}

export interface RequestWithNewUserBody extends Request {
  user: NewUserRequestBody;
}

export interface BasedNewUserControllerResult {
  httpStatusCode: number;
  message: string;
  user: NewUserRequestBody;
}

export interface RequestWithExistingUserBody extends Request {
  user: ExistingUserRequestBody;
}

export interface BasedExistingUserControllerResult {
  httpStatusCode: number;
  message: string;
  user: ExistingUserRequestBody;
}

export interface TokenUserControllerResult {
  tokenCreated: string;
}

export type LoginUserControllerResult = BasedExistingUserControllerResult &
  TokenUserControllerResult;

export interface DeleteUserControllerResult {
  httpStatusCode: number;
  message: string;
}

export type PartialUserRequestBody = Partial<UserRequestBody>;
