import { Response } from "express";
import {
  ListRolesRequest,
  RoleIdRequest,
  NewRoleRequest,
  UpdateRoleRequest,
  EntityResponse,
  EntitiesResponse,
  DeleteResponse,
  RoleServices,
} from "@/types/role.types";
import { RolesResponseDTO } from "@/dto/rolesResponse.dto";

export default function roleController(roleService: RoleServices) {
  return {
    getRolesHandler: async function (req: ListRolesRequest, res: Response) {
      try {
        const { page, limit } = req;
        const listRolesRequest: ListRolesRequest = { page, limit };
        const result: EntitiesResponse = await roleService.listRoles(
          listRolesRequest
        );
        const { httpStatusCode, message, data } = result;

        res.status(httpStatusCode).json(
          new RolesResponseDTO({
            code: httpStatusCode,
            resultMessage: message,
            data,
            dataKey: "roles",
          })
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
        const result: EntityResponse = await roleService.listRoleByID(req);
        const { httpStatusCode, message, data } = result;

        res.status(httpStatusCode).json(
          new RolesResponseDTO({
            code: httpStatusCode,
            resultMessage: message,
            data,
            dataKey: "role",
          })
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
        const result: EntityResponse = await roleService.createRole(req);
        const { httpStatusCode, message, data } = result;

        res.status(httpStatusCode).json(
          new RolesResponseDTO({
            code: httpStatusCode,
            resultMessage: message,
            data,
            dataKey: "role",
          })
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
        const result: EntityResponse = await roleService.updateRoleByID(req);
        const { httpStatusCode, message, data } = result;
        res.status(httpStatusCode).json(
          new RolesResponseDTO({
            code: httpStatusCode,
            resultMessage: message,
            data,
            dataKey: "updateRole",
          })
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
        const result: DeleteResponse = await roleService.deleteRoleByID(req);
        const { httpStatusCode, message } = result;
        res.status(httpStatusCode).json(
          new RolesResponseDTO({
            code: httpStatusCode,
            resultMessage: message
          })
        );
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
