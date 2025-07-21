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
import { UsersResponseDTO } from "@/dto/users/usersResponse.dto";
import { CrudOperationResponseDto } from "@/dto/crudOperationResponse.dto";
import { ErrorResponseDTO } from "@/dto/ErrorResponse.dto";
import { cors_secure, cors_samesite } from "@config/envvars";

export default function userController(userService: UserServices) {
  return {
    signUpHandler: async function (req: SignUpRequest, res: Response) {
      try {
        const result: EntityResponse = await userService.signUpUser(req);
        const { httpStatusCode, message, data } = result;
        if (!data) {
          return res.status(httpStatusCode).json(
            new ErrorResponseDTO({ code: httpStatusCode, resultMessage: message })
          );
        }
        const shapedData = new UsersResponseDTO(data);
        res.status(httpStatusCode).json(
          new CrudOperationResponseDto({ code: httpStatusCode, resultMessage: message, data: shapedData })
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("userController, register: " + error.message);
        } else {
          console.error("userController, register: " + error);
        }
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
          return res.status(httpStatusCode).json(
            new ErrorResponseDTO({ code: httpStatusCode, resultMessage: message })
          );
        }
        const shapedData = new UsersResponseDTO(data);
        res.status(httpStatusCode).json(
          new CrudOperationResponseDto({ code: httpStatusCode, resultMessage: message, data: shapedData })
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("userController, login: " + error.message);
        } else {
          console.error("userController, login: " + error);
        }
      }
    },

    logoutHandler: async function (
      req: AuthenticatedUserRequest,
      res: Response
    ) {
      try {
        console.log(`LogFile: User ${req.user?.sub} is logging out`);
        res.clearCookie("nodetodo");
        res.status(200).json(
          new CrudOperationResponseDto({ code: 200, resultMessage: "LOGOUT_SUCCESSFUL" })
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("userController, logout: " + error.message);
        } else {
          console.error("userController, logout: " + error);
        }
        res.status(500).json(
          new ErrorResponseDTO({ code: 500, resultMessage: "UNKNOWN_SERVER_ERROR" })
        );
      }
    },

    listUsersHandler: async function (
      req: AuthenticatedUserRequest,
      res: Response
    ) {
      try {
        const userId = req.user?.sub;
        if (!userId) {
          return res.status(401).json(
            new ErrorResponseDTO({ code: 401, resultMessage: "NOT_AUTHORIZED" })
          );
        }
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const listUsersRequest: ListUsersRequest = { page, limit };
        const result: EntitiesResponse = await userService.listUsers(listUsersRequest);
        const { httpStatusCode, message, data } = result;
        if (!data || !Array.isArray(data) || data.length === 0) {
          return res.status(httpStatusCode).json(
            new ErrorResponseDTO({ code: httpStatusCode, resultMessage: message })
          );
        }
        const shapedDataList = data.map(user => new UsersResponseDTO(user));
        res.status(httpStatusCode).json(
          new CrudOperationResponseDto({ code: httpStatusCode, resultMessage: message, dataList: shapedDataList })
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("userController, listUsers: " + error.message);
        } else {
          console.error("userController, listUsers: " + error);
        }
      }
    },

    listUserHandler: async function (
      req: AuthenticatedUserRequest,
      res: Response
    ) {
      try {
        const userId = req.user?.sub;
        if (!userId) {
          return res.status(401).json(
            new ErrorResponseDTO({ code: 401, resultMessage: "NOT_AUTHORIZED" })
          );
        }
        const result: EntityResponse = await userService.listUserByID(userId);
        const { httpStatusCode, message, data } = result;
        if (!data) {
          return res.status(httpStatusCode).json(
            new ErrorResponseDTO({ code: httpStatusCode, resultMessage: message })
          );
        }
        const shapedData = new UsersResponseDTO(data);
        res.status(httpStatusCode).json(
          new CrudOperationResponseDto({ code: httpStatusCode, resultMessage: message, data: shapedData })
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("userController, listUser: " + error.message);
        } else {
          console.error("userController, listUser: " + error);
        }
      }
    },

    updateUserDetailsHandler: async function (
      req: UpdateUserRequest,
      res: Response
    ) {
      try {
        const result: EntityResponse = await userService.updateUserDetailsByID(req);
        const { httpStatusCode, message, data } = result;
        if (!data) {
          return res.status(httpStatusCode).json(
            new ErrorResponseDTO({ code: httpStatusCode, resultMessage: message })
          );
        }
        const shapedData = new UsersResponseDTO(data);
        res.status(httpStatusCode).json(
          new CrudOperationResponseDto({ code: httpStatusCode, resultMessage: message, data: shapedData })
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("userController, updateDetails: " + error.message);
        } else {
          console.error("userController, updateDetails: " + error);
        }
      }
    },

    updateUserPasswordHandler: async function (
      req: UpdateUserRequest,
      res: Response
    ) {
      try {
        const result: EntityResponse = await userService.updateUserPasswordByID(req);
        const { httpStatusCode, message, data } = result;
        if (!data) {
          return res.status(httpStatusCode).json(
            new ErrorResponseDTO({ code: httpStatusCode, resultMessage: message })
          );
        }
        const shapedData = new UsersResponseDTO(data);
        res.status(httpStatusCode).json(
          new CrudOperationResponseDto({ code: httpStatusCode, resultMessage: message, data: shapedData })
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("userController, updateDetails: " + error.message);
        } else {
          console.error("userController, updateDetails: " + error);
        }
      }
    },

    deleteUserHandler: async function (
      req: AuthenticatedUserRequest,
      res: Response
    ) {
      try {
        const userId = req.user?.sub;
        if (!userId) {
          return res.status(401).json(
            new ErrorResponseDTO({ code: 401, resultMessage: "NOT_AUTHORIZED" })
          );
        }
        const result: DeleteLogoutResponse = await userService.deleteUserByID(userId);
        const { httpStatusCode, message } = result;
        if (httpStatusCode === 200) {
          res.clearCookie("nodetodo");
        }
        res.status(httpStatusCode).json(
          new CrudOperationResponseDto({ code: httpStatusCode, resultMessage: message })
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("userController, deleteUser: " + error.message);
        } else {
          console.error("userController, deleteUser: " + error);
        }
      }
    },
  };
}
