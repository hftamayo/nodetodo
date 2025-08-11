import { Response } from "express";
import {
  AuthenticatedUserRequest,
  ListUsersRequest,
  SignUpRequest,
  LoginRequest,
  UpdateUserRequest,
  EntityResponse,
  EntitiesResponse,
  DeleteLogoutResponse,
  UserServices,
} from "@/types/user.types";
import { UsersResponseDTO } from "@/api/dto/users/usersResponse.dto";
import {
  successResponse,
  errorResponse,
} from "@/utils/endpoints/apiMakeResponse";
import { EndpointResponseDto } from "@/api/dto/EndpointResponse.dto";
import { cors_secure, cors_samesite } from "@config/envvars";

export default function userController(userService: UserServices) {
  return {
    signUpHandler: async function (req: SignUpRequest, res: Response) {
      try {
        const result: EntityResponse = await userService.signUpUser(req);
        const { httpStatusCode, message, data } = result;
        if (!data) {
          const errorResp = errorResponse(httpStatusCode, message);
          return res.status(httpStatusCode).json(errorResp);
        }
        const shapedData = new UsersResponseDTO(data);
        // Using EndpointResponseDto<UsersResponseDTO> for type safety
        const response: EndpointResponseDto<UsersResponseDTO> = successResponse(
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

    loginHandler: async function (req: LoginRequest, res: Response) {
      try {
        const result: EntityResponse = await userService.loginUser(req);
        const { httpStatusCode, tokenCreated, message, data } = result;
        if (httpStatusCode === 200 && tokenCreated) {
          res.cookie("nodetodo", tokenCreated, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours,
            secure: cors_secure, // sent the cookie only if https is enabled
            sameSite: cors_samesite,
            path: "/",
          });
        }
        if (!data) {
          const errorResp = errorResponse(httpStatusCode, message);
          return res.status(httpStatusCode).json(errorResp);
        }
        const shapedData = new UsersResponseDTO(data);
        // Using EndpointResponseDto<UsersResponseDTO> for type safety
        const response: EndpointResponseDto<UsersResponseDTO> = successResponse(
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

    logoutHandler: async function (
      req: AuthenticatedUserRequest,
      res: Response
    ) {
      try {
        res.clearCookie("nodetodo");
        // Using EndpointResponseDto<null> for logout (no data returned)
        const response: EndpointResponseDto<null> = successResponse(
          null,
          undefined,
          200,
          "LOGOUT_SUCCESSFUL"
        );
        res.status(200).json(response);
      } catch (error: unknown) {
        const errorResp = errorResponse(
          500,
          "Internal server error",
          error instanceof Error ? error.message : String(error)
        );
        return res.status(500).json(errorResp);
      }
    },

    listUsersHandler: async function (
      req: AuthenticatedUserRequest,
      res: Response
    ) {
      try {
        const userId = req.user?.sub;
        if (!userId) {
          const errorResp = errorResponse(401, "NOT_AUTHORIZED");
          return res.status(401).json(errorResp);
        }
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const listUsersRequest: ListUsersRequest = { page, limit };
        const result: EntitiesResponse = await userService.listUsers(
          listUsersRequest
        );
        const { httpStatusCode, message, data } = result;
        if (!data || !Array.isArray(data) || data.length === 0) {
          const errorResp = errorResponse(httpStatusCode, message);
          return res.status(httpStatusCode).json(errorResp);
        }
        const shapedDataList = data.map((user) => new UsersResponseDTO(user));
        // Using EndpointResponseDto<UsersResponseDTO[]> for type safety
        const response: EndpointResponseDto<UsersResponseDTO> = successResponse(
          undefined,
          shapedDataList,
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

    listUserHandler: async function (
      req: AuthenticatedUserRequest,
      res: Response
    ) {
      try {
        const userId = req.user?.sub;
        if (!userId) {
          const errorResp = errorResponse(401, "NOT_AUTHORIZED");
          return res.status(401).json(errorResp);
        }
        const result: EntityResponse = await userService.listUserByID(userId);
        const { httpStatusCode, message, data } = result;
        if (!data) {
          const errorResp = errorResponse(httpStatusCode, message);
          return res.status(httpStatusCode).json(errorResp);
        }
        const shapedData = new UsersResponseDTO(data);
        // Using EndpointResponseDto<UsersResponseDTO> for type safety
        const response: EndpointResponseDto<UsersResponseDTO> = successResponse(
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

    updateUserDetailsHandler: async function (
      req: UpdateUserRequest,
      res: Response
    ) {
      try {
        const result: EntityResponse = await userService.updateUserDetailsByID(
          req
        );
        const { httpStatusCode, message, data } = result;
        if (!data) {
          const errorResp = errorResponse(httpStatusCode, message);
          return res.status(httpStatusCode).json(errorResp);
        }
        const shapedData = new UsersResponseDTO(data);
        // Using EndpointResponseDto<UsersResponseDTO> for type safety
        const response: EndpointResponseDto<UsersResponseDTO> = successResponse(
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

    updateUserPasswordHandler: async function (
      req: UpdateUserRequest,
      res: Response
    ) {
      try {
        const result: EntityResponse = await userService.updateUserPasswordByID(
          req
        );
        const { httpStatusCode, message, data } = result;
        if (!data) {
          const errorResp = errorResponse(httpStatusCode, message);
          return res.status(httpStatusCode).json(errorResp);
        }
        const shapedData = new UsersResponseDTO(data);
        // Using EndpointResponseDto<UsersResponseDTO> for type safety
        const response: EndpointResponseDto<UsersResponseDTO> = successResponse(
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

    deleteUserHandler: async function (
      req: AuthenticatedUserRequest,
      res: Response
    ) {
      try {
        const userId = req.user?.sub;
        if (!userId) {
          const errorResp = errorResponse(401, "NOT_AUTHORIZED");
          return res.status(401).json(errorResp);
        }
        const result: DeleteLogoutResponse = await userService.deleteUserByID(
          userId
        );
        const { httpStatusCode, message } = result;
        if (httpStatusCode === 200) {
          res.clearCookie("nodetodo");
        }
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
