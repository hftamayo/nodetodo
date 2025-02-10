import {
  CreateRoleResponse,
  FilteredRole,
  FullRole,
  ListRoleResponse,
  ListRolesRequest,
  ListRolesResponse,
  NewRoleRequest,
  RoleIdRequest,
} from "@/types/role.types";
import Role from "../models/Role";

const listRoles = async function (
  params: ListRolesRequest
): Promise<ListRolesResponse> {
  const { page, limit } = params;
  try {
    const skip = (page - 1) * limit;
    const roles = await Role.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    if (!roles || roles.length === 0) {
      return { httpStatusCode: 404, message: "ROLES_NOT_FOUND" };
    }
    const fetchedRoles: FullRole[] = roles.map((role) => ({
      _id: role._id,
      name: role.name,
      description: role.description,
      status: role.status,
      permissions: role.permissions,
    }));
    return {
      httpStatusCode: 200,
      message: "ROLES_FOUND",
      roles: fetchedRoles,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("roleService, listRoles: " + error.message);
    } else {
      console.error("roleService, listRoles: " + error);
    }
    return { httpStatusCode: 500, message: "UNKNOWN_ERROR" };
  }
};

const listRoleByID = async function (
  params: RoleIdRequest
): Promise<ListRoleResponse> {
  const roleId = params.roleId;
  try {
    let searchRole = await Role.findById(roleId).exec();

    if (!searchRole) {
      return { httpStatusCode: 404, message: "ENTITY_NOT_FOUND" };
    }

    const filteredRole: FilteredRole = {
      _id: searchRole._id,
      name: searchRole.name,
      description: searchRole.description,
      status: searchRole.status,
      permissions: searchRole.permissions,
    };

    return { httpStatusCode: 200, message: "ENTITY_FOUND", role: filteredRole };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("roleService, listItemByID: " + error.message);
    } else {
      console.error("roleService, listItemByID: " + error);
    }
    return { httpStatusCode: 500, message: "UNKNOWN_ERROR" };
  }
};

const createRole = async function (
  params: NewRoleRequest
): Promise<CreateRoleResponse> {
  const { name, description, status, permissions } = params.role;

  if (!name || !description || !status || !permissions) {
    return { httpStatusCode: 400, message: "MISSING_FIELDS" };
  }

  try {
    let newRole = await Role.findOne({ name }).exec();

    if (newRole) {
      return { httpStatusCode: 400, message: "ROLE_ALREADY_EXISTS" };
    }

    newRole = new Role({ name, description, status, permissions });
    await newRole.save();

    const filteredRole: FilteredRole = {
      _id: newRole._id,
      name: newRole.name,
      description: newRole.description,
      status: newRole.status,
      permissions: newRole.permissions,
    };

    return {
      httpStatusCode: 201,
      message: "ROLE_CREATED",
      role: filteredRole,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("roleService, createRole: " + error.message);
    } else {
      console.error("roleService, createRole: " + error);
    }
    return { httpStatusCode: 500, message: "UNKNOWN_ERROR" };
  }
};
