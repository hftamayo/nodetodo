import mongoose, { Document } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

export enum UserRole {
  ADMIN = "administrator",
  SUPERVISOR = "supervisor",
  USER = "finaluser",
}

export type FullUser = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  age: number;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
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

// Define a type for the filtered user object
export type FilteredSignUpUser = Omit<FullUser, "password" | "updatedAt">;

export type SignUpUserResponse = {
  httpStatusCode: number;
  message: string;
  user: FilteredSignUpUser;
};

//interfaces for dependency injection pattern
export type UserServices = {
  signUpUser: (newSignUpUser: UserRequest) => Promise<SignUpUserResponse>;
  loginUser: (newLoginUser: LoginRequest) => Promise<UserResult>;
  logoutUser: (newLogoutUser: Request) => Promise<UserResult>;
  listUserByID: (newListUser: UserIdRequest) => Promise<UserResult>;
  updateUserDetailsByID: (params: UpdateUserRequest) => Promise<UserResult>;
  updateUserPasswordByID: (params: UpdateUserRequest) => Promise<UserResult>;
  deleteUserByID: (newDeleteUser: UserIdRequest) => Promise<UserResult>;
};
