import { Request } from "express";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";

export type FullUser = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  age: number;
  role: mongoose.Types.ObjectId;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface AuthenticatedUser {
  sub: string;
  role: string;
}

export interface AuthenticatedUserRequest extends Request {
  user?: AuthenticatedUser;
}

export type JwtActiveSession = JwtPayload &
  AuthenticatedUser & {
    sessionId: string;
    ver: string;
  };

export type UserRequest = {
  id?: string;
  name: string;
  email: string;
  age: number;
  password: string;
  updatePassword?: string;
  status?: boolean;
};

export type SignUpRequest = UserRequest & {
  repeatPassword: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type ListUsersRequest = {
  page: number;
  limit: number;
};

export type UpdateUserRequest = {
  userId: string;
  user: Partial<UserRequest>;
};

export type FilteredUser = Pick<
  FullUser,
  "_id" | "name" | "email" | "role" | "status"
>;

export type ApiResponse<T> = {
  httpStatusCode: number;
  message: string;
  tokenCreated?: string;
  data?: T;
};

export type EntityResponse = ApiResponse<FilteredUser>;
export type EntitiesResponse = ApiResponse<FilteredUser[]>;
export type DeleteLogoutResponse = ApiResponse<null>;

//interfaces for dependency injection pattern
export type UserServices = {
  signUpUser: (params: UserRequest) => Promise<EntityResponse>;
  loginUser: (params: LoginRequest) => Promise<EntityResponse>;
  logoutUser: (
    params: AuthenticatedUserRequest
  ) => Promise<DeleteLogoutResponse>;
  listUsers: (params: ListUsersRequest) => Promise<EntitiesResponse>;
  listUserByID: (params: string) => Promise<EntityResponse>;
  updateUserDetailsByID: (params: UpdateUserRequest) => Promise<EntityResponse>;
  updateUserPasswordByID: (
    params: UpdateUserRequest
  ) => Promise<EntityResponse>;
  deleteUserByID: (params: string) => Promise<DeleteLogoutResponse>;
};
