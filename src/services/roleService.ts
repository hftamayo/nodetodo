import {
  FilteredRole,
  ListRolesRequest,
  NewRoleRequest,
  RoleIdRequest,
  UpdateRoleRequest,
  EntityResponse,
  EntitiesResponse,
  DeleteResponse,
} from "@/types/role.types";
import { makeResponse } from "@/utils/messages/apiMakeResponse";
import Role from "@models/Role";

const listRoles = async function (
  params: ListRolesRequest
): Promise<EntitiesResponse> {
  const { page, limit } = params;
  try {
    const skip = (page - 1) * limit;
    const roles = await Role.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    if (!roles || roles.length === 0) {
      return makeResponse("ERROR");
    }
    const fetchedRoles: FilteredRole[] = roles.map((role) => ({
      _id: role._id,
      name: role.name,
      description: role.description,
      status: role.status,
      permissions: Object.fromEntries(Object.entries(role.permissions)),
    }));
    return makeResponse("SUCCESS", { data: fetchedRoles });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("roleService, listRoles: " + error.message);
    } else {
      console.error("roleService, listRoles: " + error);
    }
    return makeResponse("INTERNAL_SERVER_ERROR");
  }
};

const listRoleByID = async function (
  params: RoleIdRequest
): Promise<EntityResponse> {
  const roleId = params.roleId;
  try {
    let searchRole = await Role.findById(roleId).exec();

    if (!searchRole) {
      return makeResponse("ERROR");
    }

    const filteredRole: FilteredRole = {
      _id: searchRole._id,
      name: searchRole.name,
      description: searchRole.description,
      status: searchRole.status,
      permissions: Object.fromEntries(Object.entries(searchRole.permissions)),
    };

    return makeResponse("SUCCESS", { data: filteredRole });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("roleService, listItemByID: " + error.message);
    } else {
      console.error("roleService, listItemByID: " + error);
    }
    return makeResponse("INTERNAL_SERVER_ERROR");
  }
};

const createRole = async function (
  params: NewRoleRequest
): Promise<EntityResponse> {
  const { name, description, status, permissions } = params.role;

  if (!name || !description || !status || !permissions) {
    return makeResponse("BAD_REQUEST");
  }

  try {
    let newRole = await Role.findOne({ name }).exec();

    if (newRole) {
      return makeResponse("ENTITY_ALREADY_EXISTS");
    }

    newRole = new Role({ name, description, status, permissions });
    await newRole.save();

    const filteredRole: FilteredRole = {
      _id: newRole._id,
      name: newRole.name,
      description: newRole.description,
      status: newRole.status,
      permissions: Object.fromEntries(Object.entries(newRole.permissions)),
    };

    return makeResponse("CREATED", { data: filteredRole });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("roleService, createRole: " + error.message);
    } else {
      console.error("roleService, createRole: " + error);
    }
    return makeResponse("INTERNAL_SERVER_ERROR");
  }
};

const updateRoleByID = async function (
  params: UpdateRoleRequest
): Promise<EntityResponse> {
  const { _id, ...updates } = params.role;

  if (!_id || Object.keys(updates).length === 0) {
    return makeResponse("BAD_REQUEST");
  }

  try {
    let searchRole = await Role.findById(_id).exec();

    if (!searchRole) {
      return makeResponse("ERROR");
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

    return makeResponse("SUCCESS", { data: filteredRole });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("roleService, updateRoleByID: " + error.message);
    } else {
      console.error("roleService, updateRoleByID: " + error);
    }
    return makeResponse("INTERNAL_SERVER_ERROR");
  }
};

const deleteRoleByID = async function (
  params: RoleIdRequest
): Promise<DeleteResponse> {
  const roleId = params.roleId;
  try {
    let searchRole = await Role.findById(roleId).exec();
    if (!searchRole) {
      return makeResponse("ERROR");
    }
    await searchRole.deleteOne();
    return makeResponse("SUCCESS");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("roleService, deleteRoleByID: " + error.message);
    } else {
      console.error("roleService, deleteRoleByID: " + error);
    }
    return makeResponse("INTERNAL_SERVER_ERROR");
  }
};

export default {
  listRoles,
  listRoleByID,
  createRole,
  updateRoleByID,
  deleteRoleByID,
};
