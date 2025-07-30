import {
  FilteredRole,
  ListRolesRequest,
  NewRoleRequest,
  RoleIdRequest,
  UpdateRoleRequest,
  EntityResponse,
  DeleteResponse,
} from "@/types/role.types";
import Role from "@models/Role";
import { paginate } from "@/services/paginationService";
import { PaginatedResponseDTO } from "@/dto/pagination/pagination.dto";
import { ErrorResponseDTO } from "@/dto/error/ErrorResponse.dto";

const listRoles = async function (
  params: ListRolesRequest
): Promise<PaginatedResponseDTO<FilteredRole> | ErrorResponseDTO> {
  const {
    page = 1,
    limit = 5,
    cursor,
    sort = "createdAt",
    order = "desc",
    filters = {},
  } = params;

  const paginated = await paginate(Role, {
    page,
    limit,
    cursor,
    sort,
    order,
    filters,
  });

  // Check if paginated is an error response
  if ("code" in paginated && "resultMessage" in paginated) {
    return paginated;
  }

  // Map roles to FilteredRole
  const mappedData: FilteredRole[] = paginated.data.map((role: any) => ({
    _id: role._id,
    name: role.name,
    description: role.description,
    status: role.status,
    permissions: Object.fromEntries(Object.entries(role.permissions)),
  }));

  return new PaginatedResponseDTO({
    data: mappedData,
    pagination: paginated.pagination,
    etag: paginated.etag,
    lastModified: paginated.lastModified,
  });
};

const listRoleByID = async function (
  params: RoleIdRequest
): Promise<EntityResponse> {
  const roleId = params.roleId;
  const searchRole = await Role.findById(roleId).exec();

  if (!searchRole) {
    return {
      httpStatusCode: 404,
      message: "Role not found",
    };
  }

  const filteredRole: FilteredRole = {
    _id: searchRole._id,
    name: searchRole.name,
    description: searchRole.description,
    status: searchRole.status,
    permissions: Object.fromEntries(Object.entries(searchRole.permissions)),
  };

  return {
    httpStatusCode: 200,
    message: "Role retrieved successfully",
    data: filteredRole,
  };
};

const createRole = async function (
  params: NewRoleRequest
): Promise<EntityResponse> {
  const { name, description, status, permissions } = params.role;

  if (!name || !description || !status || !permissions) {
    return {
      httpStatusCode: 400,
      message: "Missing required fields",
    };
  }

  const existingRole = await Role.findOne({ name }).exec();
  if (existingRole) {
    return {
      httpStatusCode: 409,
      message: "Role with this name already exists",
    };
  }

  const newRole = new Role({ name, description, status, permissions });
  await newRole.save();

  const filteredRole: FilteredRole = {
    _id: newRole._id,
    name: newRole.name,
    description: newRole.description,
    status: newRole.status,
    permissions: Object.fromEntries(Object.entries(newRole.permissions)),
  };

  return {
    httpStatusCode: 201,
    message: "Role created successfully",
    data: filteredRole,
  };
};

const updateRoleByID = async function (
  params: UpdateRoleRequest
): Promise<EntityResponse> {
  const { _id, ...updates } = params.role;

  if (!_id || Object.keys(updates).length === 0) {
    return {
      httpStatusCode: 400,
      message: "Missing required fields",
    };
  }

  const searchRole = await Role.findById(_id).exec();
  if (!searchRole) {
    return {
      httpStatusCode: 404,
      message: "Role not found",
    };
  }

  if (updates.name !== undefined) searchRole.name = updates.name;
  if (updates.description !== undefined)
    searchRole.description = updates.description;
  if (updates.status !== undefined) searchRole.status = updates.status;
  if (updates.permissions !== undefined) {
    searchRole.permissions = new Map(Object.entries(updates.permissions));
  }

  await searchRole.save();

  const filteredRole: FilteredRole = {
    _id: searchRole._id,
    name: searchRole.name,
    description: searchRole.description,
    status: searchRole.status,
    permissions: Object.fromEntries(Object.entries(searchRole.permissions)),
  };

  return {
    httpStatusCode: 200,
    message: "Role updated successfully",
    data: filteredRole,
  };
};

const deleteRoleByID = async function (
  params: RoleIdRequest
): Promise<DeleteResponse> {
  const roleId = params.roleId;
  const searchRole = await Role.findById(roleId).exec();

  if (!searchRole) {
    return {
      httpStatusCode: 404,
      message: "Role not found",
    };
  }

  await searchRole.deleteOne();

  return {
    httpStatusCode: 200,
    message: "Role deleted successfully",
  };
};

export default {
  listRoles,
  listRoleByID,
  createRole,
  updateRoleByID,
  deleteRoleByID,
};
