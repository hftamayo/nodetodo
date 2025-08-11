import { Response } from "express";
import {
  ListRolesRequest,
  RoleIdRequest,
  NewRoleRequest,
  UpdateRoleRequest,
  EntityResponse,
  DeleteResponse,
  RoleServices,
} from "@/types/role.types";
import { RolesResponseDTO } from "@/api/v1/dto/roles/rolesResponse.dto";
import {
  successResponse,
  errorResponse,
} from "@/utils/endpoints/apiMakeResponse";
import { ErrorResponseDTO } from "@/api/v1/dto/error/ErrorResponse.dto";
import { EndpointResponseDto } from "@/api/v1/dto/EndpointResponse.dto";

function isErrorResponse(obj: any): obj is ErrorResponseDTO {
  return (
    obj && typeof obj.code === "number" && typeof obj.resultMessage === "string"
  );
}

export default function roleController(roleService: RoleServices) {
  return {
    getRolesHandler: async function (req: ListRolesRequest, res: Response) {
      try {
        const { page, limit, cursor, sort, order, filters } = req;
        const listRolesRequest: ListRolesRequest = {
          page,
          limit,
          cursor,
          sort,
          order,
          filters,
        };
        const result = await roleService.listRoles(listRolesRequest);
        if (isErrorResponse(result)) {
          return res.status(result.code).json(result);
        }
        res.status(200).json(result);
      } catch (error: unknown) {
        const errorResp = errorResponse(
          500,
          "Internal server error",
          error instanceof Error ? error.message : String(error)
        );
        return res.status(500).json(errorResp);
      }
    },

    getRoleHandler: async function (req: RoleIdRequest, res: Response) {
      try {
        const result: EntityResponse = await roleService.listRoleByID(req);
        const { httpStatusCode, message, data } = result;
        if (!data) {
          const errorResp = errorResponse(httpStatusCode, message);
          return res.status(httpStatusCode).json(errorResp);
        }
        const shapedData = new RolesResponseDTO(data);
        // Using EndpointResponseDto<RolesResponseDTO> for type safety
        const response: EndpointResponseDto<RolesResponseDTO> = successResponse(
          shapedData,
          undefined,
          httpStatusCode,
          message
        );
        res.status(httpStatusCode).json(response);
      } catch (error: unknown) {
        const errorResp = errorResponse(
          500,
          "Internal server error",
          error instanceof Error ? error.message : String(error)
        );
        return res.status(500).json(errorResp);
      }
    },

    newRoleHandler: async function (req: NewRoleRequest, res: Response) {
      try {
        const result: EntityResponse = await roleService.createRole(req);
        const { httpStatusCode, message, data } = result;
        if (!data) {
          const errorResp = errorResponse(httpStatusCode, message);
          return res.status(httpStatusCode).json(errorResp);
        }
        const shapedData = new RolesResponseDTO(data);
        // Using EndpointResponseDto<RolesResponseDTO> for type safety
        const response: EndpointResponseDto<RolesResponseDTO> = successResponse(
          shapedData,
          undefined,
          httpStatusCode,
          message
        );
        res.status(httpStatusCode).json(response);
      } catch (error: unknown) {
        const errorResp = errorResponse(
          500,
          "Internal server error",
          error instanceof Error ? error.message : String(error)
        );
        return res.status(500).json(errorResp);
      }
    },

    updateRoleHandler: async function (req: UpdateRoleRequest, res: Response) {
      try {
        const result: EntityResponse = await roleService.updateRoleByID(req);
        const { httpStatusCode, message, data } = result;
        if (!data) {
          const errorResp = errorResponse(httpStatusCode, message);
          return res.status(httpStatusCode).json(errorResp);
        }
        const shapedData = new RolesResponseDTO(data);
        // Using EndpointResponseDto<RolesResponseDTO> for type safety
        const response: EndpointResponseDto<RolesResponseDTO> = successResponse(
          shapedData,
          undefined,
          httpStatusCode,
          message
        );
        res.status(httpStatusCode).json(response);
      } catch (error: unknown) {
        const errorResp = errorResponse(
          500,
          "Internal server error",
          error instanceof Error ? error.message : String(error)
        );
        return res.status(500).json(errorResp);
      }
    },

    deleteRoleHandler: async function (req: RoleIdRequest, res: Response) {
      try {
        const result: DeleteResponse = await roleService.deleteRoleByID(req);
        const { httpStatusCode, message } = result;
        // Using EndpointResponseDto<null> for delete operations (no data returned)
        const response: EndpointResponseDto<null> = successResponse(
          null,
          undefined,
          httpStatusCode,
          message
        );
        res.status(httpStatusCode).json(response);
      } catch (error: unknown) {
        const errorResp = errorResponse(
          500,
          "Internal server error",
          error instanceof Error ? error.message : String(error)
        );
        return res.status(500).json(errorResp);
      }
    },
  };
}
