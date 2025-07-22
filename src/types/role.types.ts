import mongoose, { Document } from "mongoose";
import { PaginatedResponseDTO } from "@/dto/pagination/pagination.dto";
import { ErrorResponseDTO } from "@/dto/ErrorResponse.dto";

export interface RoleDocument extends Document {
  name: string;
  description: string;
  status: boolean;
  permissions: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

export type FullRole = {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  status: boolean;
  permissions: {
    [domain: string]: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

type RoleRequest = {
  _id?: string;
  name: string;
  description: string;
  status?: boolean;
  permissions: {
    [domain: string]: number;
  };
};

export type NewRoleRequest = {
  role: RoleRequest;
};

export type ListRolesRequest = {
  page?: number;
  limit?: number;
  cursor?: string;
  sort?: string;
  order?: "asc" | "desc";
  filters?: Record<string, any>;
};

export type RoleIdRequest = {
  roleId: string;
};

export type UpdateRoleRequest = {
  role: Partial<RoleRequest>;
};

export type FilteredRole = Omit<FullRole, "createdAt" | "updatedAt">;

export type ApiResponse<T> = {
  httpStatusCode: number;
  message: string;
  data?: T;
};

export type EntityResponse = ApiResponse<FilteredRole>;
export type DeleteResponse = ApiResponse<null>;

export type RoleServices = {
  createRole: (params: NewRoleRequest) => Promise<EntityResponse>;
  listRoles: (params: ListRolesRequest) => Promise<PaginatedResponseDTO<FilteredRole> | ErrorResponseDTO>;
  listRoleByID: (params: RoleIdRequest) => Promise<EntityResponse>;
  updateRoleByID: (params: UpdateRoleRequest) => Promise<EntityResponse>;
  deleteRoleByID: (params: RoleIdRequest) => Promise<DeleteResponse>;
};
