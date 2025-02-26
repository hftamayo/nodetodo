import mongoose from "mongoose";

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
  status: boolean;
  permissions: string[];
};

export type NewRoleRequest = {
  role: RoleRequest;
};

export type ListRolesRequest = {
  page: number;
  limit: number;
};

export type RoleIdRequest = {
  roleId: string;
};

export type UpdateRoleRequest = {
  roleId: string;
  role: Partial<RoleRequest>;
};

export type FilteredRole = Omit<FullRole, "createdAt" | "updatedAt">;

export type CreateRoleResponse = {
  httpStatusCode: number;
  message: string;
  role?: FilteredRole;
};

export type ListRolesResponse = {
  httpStatusCode: number;
  message: string;
  roles?: FilteredRole[];
};

export type ListRoleResponse = {
  httpStatusCode: number;
  message: string;
  role?: FilteredRole;
};

export type UpdateRoleResponse = {
  httpStatusCode: number;
  message: string;
  role?: FilteredRole;
};

export type DeleteRoleResponse = {
  httpStatusCode: number;
  message: string;
};

export type RoleServices = {
  createRole: (params: NewRoleRequest) => Promise<CreateRoleResponse>;
  listRoles: (params: ListRolesRequest) => Promise<ListRolesResponse>;
  listRoleByID: (params: RoleIdRequest) => Promise<ListRoleResponse>;
  updateRoleByID: (params: UpdateRoleRequest) => Promise<UpdateRoleResponse>;
  deleteRoleByID: (params: RoleIdRequest) => Promise<DeleteRoleResponse>;
};
