import { Request, Response } from "express";
import {
  AuthenticatedUserRequest,
  ListUsersRequest,
  SignUpRequest,
  LoginRequest,
  UpdateUserRequest,
  SignUpUserResponse,
  LoginResponse,
  SearchUserByIdResponse,
  DeleteUserByIdResponse,
  UpdateUserDetailsResponse,
  SearchUsersResponse,
  UserServices,
} from "../../types/user.types";
import { cors_secure, cors_samesite } from "../../config/envvars";

export default function userController(userService: UserServices) {
  return {
    signUpHandler: async function (req: SignUpRequest, res: Response) {
      try {
        const result: SignUpUserResponse = await userService.signUpUser(req);
        const { httpStatusCode, message, user } = result;

        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 201
              ? { code: httpStatusCode, resultMessage: message, user: user }
              : { code: httpStatusCode, resultMessage: message }
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
        const result: LoginResponse = await userService.loginUser(req);
        const { httpStatusCode, tokenCreated, message, user } = result;

        if (httpStatusCode === 200) {
          res.cookie("nodetodo", tokenCreated, {
            httpOnly: true,
            maxAge: 360000,
            secure: cors_secure, // sent the cookie only if https is enabled
            sameSite: cors_samesite,
            path: "/",
          });
        }

        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 200
              ? { code: httpStatusCode, resultMessage: message, user: user }
              : { code: httpStatusCode, resultMessage: message }
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
        console.log(`LogFile: User ${req.user?.id} is logging out`);
        res.clearCookie("nodetodo");
        res.status(200).json({
          code: 200,
          resultMessage: "LOGOUT_SUCCESSFUL",
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("userController, logout: " + error.message);
        } else {
          console.error("userController, logout: " + error);
        }
        res.status(500).json({
          code: 500,
          resultMessage: "UNKNOWN_ERROR",
        });
      }
    },

    listUsersHandler: async function (
      req: AuthenticatedUserRequest,
      res: Response
    ) {
      try {
        const userId = req.user?.id;
        if (!userId) {
          return res
            .status(401)
            .json({ code: 401, resultMessage: "NOT_AUTHORIZED" });
        }
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const listUsersRequest: ListUsersRequest = { page, limit };
        const result: SearchUsersResponse = await userService.listUsers(
          listUsersRequest
        );
        const { httpStatusCode, message, users } = result;
        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 200
              ? { code: httpStatusCode, resultMessage: message, users: users }
              : { code: httpStatusCode, resultMessage: message }
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
        const userId = req.user?.id;
        if (!userId) {
          return res
            .status(401)
            .json({ code: 401, resultMessage: "NOT_AUTHORIZED" });
        }
        const result: SearchUserByIdResponse = await userService.listUserByID(
          userId
        );
        const { httpStatusCode, message, user } = result;
        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 200
              ? { code: httpStatusCode, resultMessage: message, user: user }
              : { code: httpStatusCode, resultMessage: message }
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
        const result: UpdateUserDetailsResponse =
          await userService.updateUserDetailsByID(req);
        const { httpStatusCode, message, user } = result;
        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 200
              ? { code: httpStatusCode, resultMessage: message, user: user }
              : { code: httpStatusCode, resultMessage: message }
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
        const result: UpdateUserDetailsResponse =
          await userService.updateUserPasswordByID(req);

        const { httpStatusCode, message, user } = result;

        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 200
              ? { code: httpStatusCode, resultMessage: message, user: user }
              : { code: httpStatusCode, resultMessage: message }
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
        const userId = req.user?.id;
        if (!userId) {
          return res
            .status(401)
            .json({ code: 401, resultMessage: "NOT_AUTHORIZED" });
        }
        const result: DeleteUserByIdResponse = await userService.deleteUserByID(
          userId
        );
        const { httpStatusCode, message } = result;

        if (httpStatusCode === 200) {
          res.clearCookie("nodetodo");
        }
        res
          .status(httpStatusCode)
          .json({ code: httpStatusCode, resultMessage: message });
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
