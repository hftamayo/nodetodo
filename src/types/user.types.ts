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
  id: string;
  role: string;
}

export interface AuthenticatedUserRequest extends Request {
  user?: AuthenticatedUser;
}

export type UserRequest = {
  id?: string;
  name: string;
  email: string;
  age: number;
  password: string;
  updatePassword?: string;
};

export type SignUpRequest = UserRequest & {
  repeatPassword: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type JwtPayloadWithUserId = JwtPayload & {
  userId: string;
};

export type ListUsersRequest = {
  page: number;
  limit: number;
};

export type UpdateUserRequest = {
  userId: string;
  user: Partial<UserRequest>;
};

// Define a type for the filtered user object
export type FilteredSignUpUser = Omit<FullUser, "password" | "updatedAt">;

export type FilteredLoginUser = Omit<
  FullUser,
  "password" | "createdAt" | "updatedAt"
>;

export type FilteredSearchUsers = {
  id: string;
  name: string;
  email: string;
  role: mongoose.Types.ObjectId;
  status: boolean;
};

export type FilteredSearchUserById = Pick<
  FullUser,
  "_id" | "name" | "email" | "role" | "status"
>;

export type FilteredUpdateUser = Omit<FullUser, "password" | "createdAt">;

export type SignUpUserResponse = {
  httpStatusCode: number;
  message: string;
  user?: FilteredSignUpUser;
};

export type LoginResponse = {
  httpStatusCode: number;
  message: string;
  tokenCreated?: string;
  user?: FilteredLoginUser;
};

export type LogoutResponse = {
  httpStatusCode: number;
  message: string;
};

export type SearchUsersResponse = {
  httpStatusCode: number;
  message: string;
  users?: FilteredSearchUsers[];
};

export type SearchUserByIdResponse = {
  httpStatusCode: number;
  message: string;
  user?: FilteredSearchUserById;
};

export type UpdateUserDetailsResponse = {
  httpStatusCode: number;
  message: string;
  user?: FilteredUpdateUser;
};

export type DeleteUserByIdResponse = {
  httpStatusCode: number;
  message: string;
};

//interfaces for dependency injection pattern
export type UserServices = {
  signUpUser: (params: UserRequest) => Promise<SignUpUserResponse>;
  loginUser: (params: LoginRequest) => Promise<LoginResponse>;
  logoutUser: (params: AuthenticatedUserRequest) => Promise<LogoutResponse>;
  listUsers: (params: ListUsersRequest) => Promise<SearchUsersResponse>;
  listUserByID: (params: string) => Promise<SearchUserByIdResponse>;
  updateUserDetailsByID: (
    params: UpdateUserRequest
  ) => Promise<UpdateUserDetailsResponse>;
  updateUserPasswordByID: (
    params: UpdateUserRequest
  ) => Promise<UpdateUserDetailsResponse>;
  deleteUserByID: (params: string) => Promise<DeleteUserByIdResponse>;
};
