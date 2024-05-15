import mongoose from "mongoose";
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
  newPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ValidateActiveSession {
  user?: Partial<UserRequest>;
  cookies?: { [key: string]: string };
}

export interface JwtPayloadWithUser extends JwtPayload {
  searchUser: Partial<ValidateActiveSession["user"]>;
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
