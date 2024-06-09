import mongoose, {Document} from "mongoose";
import { JwtPayload } from "jsonwebtoken";

export enum UserRole {
  ADMIN = "admin",
  SUPERVISOR = "supervisor",
  USER = "user",
}

export interface UserSeed {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  age: number;
  role: UserRole;
}

export interface UserRequest {
  id?: string;
  name: string;
  email: string;
  age: number;
  password: string;
  newPassword?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface JwtPayloadWithUserId extends JwtPayload {
  userId: string;
}

export interface UserIdRequest {
  userId: string;
}

export interface UpdateUserRequest {
  userId: string;
  user: Partial<UserRequest>;
}

export interface UserResult {
  httpStatusCode: number;
  message: string;
  tokenCreated?: string;
  user?: Partial<UserRequest & Document>;
}

//interfaces for dependency injection pattern
export interface UserServices {
  signUpUser: (newSignUpUser: UserRequest) => Promise<UserResult>;
  loginUser: (newLoginUser: LoginRequest) => Promise<UserResult>;
  logoutUser: (newLogoutUser: Request) => Promise<UserResult>;
  listUserByID: (newListUser: UserIdRequest) => Promise<UserResult>;
  updateUserDetailsByID: (params: UpdateUserRequest) => Promise<UserResult>;
  updateUserPasswordByID: (params: UpdateUserRequest) => Promise<UserResult>;
  deleteUserByID: (newDeleteUser: UserIdRequest) => Promise<UserResult>;
}
