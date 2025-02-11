import { Response } from "express";
import {
  ListRolesRequest,
  RoleIdRequest,
  NewRoleRequest,
  UpdateRoleRequest,
  ListRolesResponse,
  ListRoleResponse,
  CreateRoleResponse,
  UpdateRoleResponse,
  DeleteRoleResponse,
  RoleServices,
} from "@/types/role.types";

export default function roleController(roleService: RoleServices) {
  return {
    getRolesHandler: async function (req: ListRolesRequest, res: Response) {
      try {
        const { page, limit } = req;
        const listRolesRequest: ListRolesRequest = { page, limit };
        const result: ListRolesResponse = await roleService.listRoles(
          listRolesRequest
        );
        const { httpStatusCode, message, roles } = result;

        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 200
              ? { code: httpStatusCode, resultMessage: message, roles: roles }
              : { code: httpStatusCode, resultMessage: message }
          );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("roleController, getRoles: " + error.message);
        } else {
          console.error("roleController, getRoles: " + error);
        }
      }
    },

    getRoleHandler: async function (req: RoleIdRequest, res: Response) {
      try {
        const result: ListRoleResponse = await roleService.listRoleByID(req);
        const { httpStatusCode, message, role } = result;

        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 200
              ? { code: httpStatusCode, resultMessage: message, role: role }
              : { code: httpStatusCode, resultMessage: message }
          );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("roleController, getRole: " + error.message);
        } else {
          console.error("roleController, getRole: " + error);
        }
      }
    },

    newRoleHandler: async function (req: NewRoleRequest, res: Response) {
      try {
        const result: CreateRoleResponse = await roleService.createRole(req);
        const { httpStatusCode, message, role } = result;

        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 201
              ? { code: httpStatusCode, resultMessage: message, role: role }
              : { code: httpStatusCode, resultMessage: message }
          );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("roleController, createRole: " + error.message);
        } else {
          console.error("roleController, createRole: " + error);
        }
      }
    },

    updateRoleHandler: async function (req: UpdateRoleRequest, res: Response) {
      try {
        const result: UpdateRoleResponse = await roleService.updateRoleByID(
          req
        );
        const { httpStatusCode, message, role } = result;
        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 200
              ? { httpStatusCode, resultMessage: message, updateRole: role }
              : { httpStatusCode, resultMessage: message }
          );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("roleController, updateRole: " + error.message);
        } else {
          console.error("roleController, updateRole: " + error);
        }
      }
    },

    deleteRoleHandler: async function (req: RoleIdRequest, res: Response) {
      try {
        const result: DeleteRoleResponse = await roleService.deleteRoleByID(
          req
        );
        const { httpStatusCode, message } = result;
        res
          .status(httpStatusCode)
          .json({ code: httpStatusCode, resultMessage: message });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("roleController, deleteRole: " + error.message);
        } else {
          console.error("roleController, deleteRole: " + error);
        }
      }
    },
  };
}
