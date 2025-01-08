import mongoose, { Document } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

export enum UserRole {
  ADMIN = "administrator",
  SUPERVISOR = "supervisor",
  USER = "finaluser",
}

export type UserSeed = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  age: number;
  role: UserRole;
};

export type UserRequest = {
  id?: string;
  name: string;
  email: string;
  age: number;
  password: string;
  newPassword?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type JwtPayloadWithUserId = JwtPayload & {
  userId: string;
};

export type UserIdRequest = {
  userId: string;
};

export type UpdateUserRequest = {
  userId: string;
  user: Partial<UserRequest>;
};

export type UserResult = {
  httpStatusCode: number;
  message: string;
  tokenCreated?: string;
  user?: Partial<UserRequest & Document>;
};

//interfaces for dependency injection pattern
export type UserServices = {
  signUpUser: (newSignUpUser: UserRequest) => Promise<UserResult>;
  loginUser: (newLoginUser: LoginRequest) => Promise<UserResult>;
  logoutUser: (newLogoutUser: Request) => Promise<UserResult>;
  listUserByID: (newListUser: UserIdRequest) => Promise<UserResult>;
  updateUserDetailsByID: (params: UpdateUserRequest) => Promise<UserResult>;
  updateUserPasswordByID: (params: UpdateUserRequest) => Promise<UserResult>;
  deleteUserByID: (newDeleteUser: UserIdRequest) => Promise<UserResult>;
};
