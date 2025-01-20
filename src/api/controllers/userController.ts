import { Request, Response } from "express";
import {
  UserRequest,
  LoginRequest,
  UpdateUserRequest,
  UserIdRequest,
  UserResult,
  SignUpUserResponse,
  LoginResponse,
  UserServices,
  SearchUserByIdResponse,
  DeleteUserByIdResponse,
  UpdateUserDetailsResponse,
} from "../../types/user.types";
import { cors_secure, cors_samesite } from "../../config/envvars";

export default function userController(userService: UserServices) {
  return {
    registerHandler: async function (req: UserRequest, res: Response) {
      try {
        const result: SignUpUserResponse = await userService.signUpUser(req);
        const { httpStatusCode, message, user } = result;

        if (httpStatusCode === 201) {
          res.status(httpStatusCode).json({
            code: httpStatusCode,
            resultMessage: message,
            entity: user,
          });
        } else {
          res.status(httpStatusCode).json({
            code: httpStatusCode,
            resultMessage: message,
          });
        }
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
            secure: cors_secure, //sent the cookie only if https is enabled
            sameSite: cors_samesite,
            path: "/",
          });
          res.status(httpStatusCode).json({
            code: httpStatusCode,
            resultMessage: message,
            entity: user,
          });
        } else {
          res.status(httpStatusCode).json({
            code: httpStatusCode,
            resultMessage: message,
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("userController, login: " + error.message);
        } else {
          console.error("userController, login: " + error);
        }
      }
    },

    logoutHandler: async function (req: Request, res: Response) {
      try {
        res.clearCookie("nodetodo");
        res.status(200).json({
          httpStatusCode: 200,
          resultMessage: "LOGOUT_SUCCESFUL",
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("userController, logout: " + error.message);
        } else {
          console.error("userController, logout: " + error);
        }
        res.status(500).json({
          httpStatusCode: 500,
          resultMessage: "UNKNOWN_ERROR",
        });
      }
    },

    listUserHandler: async function (req: UserIdRequest, res: Response) {
      try {
        const result: SearchUserByIdResponse = await userService.listUserByID(
          req
        );
        const { httpStatusCode, message, user } = result;
        if (httpStatusCode === 200) {
          res.status(httpStatusCode).json({
            httpStatusCode,
            resultMessage: message,
            entity: user,
          });
        } else {
          res
            .status(httpStatusCode)
            .json({ httpStatusCode, resultMessage: message });
        }
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

        if (httpStatusCode === 200) {
          res.status(httpStatusCode).json({
            code: httpStatusCode,
            resultMessage: message,
            entity: user,
          });
        } else {
          res.status(httpStatusCode).json({
            code: httpStatusCode,
            resultMessage: message,
          });
        }
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
        const result: UserResult = await userService.updateUserPasswordByID(
          req
        );

        const { httpStatusCode, message, user } = result;

        if (!user?.toObject) {
          return res
            .status(httpStatusCode)
            .json({ httpStatusCode, resultMessage: message });
        }

        const userObject = user.toObject();
        const { password, ...filteredUser } = userObject;
        res.status(httpStatusCode).json({
          httpStatusCode,
          resultMessage: message,
          updatedUser: filteredUser,
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("userController, updatePassword: " + error.message);
        } else {
          console.error("userController, updatePassword: " + error);
        }
        res.status(500).json({
          httpStatusCode: 500,
          resultMessage: "Internal Server Error",
        });
      }
    },

    deleteUserHandler: async function (req: UserIdRequest, res: Response) {
      try {
        const result: DeleteUserByIdResponse = await userService.deleteUserByID(
          req
        );
        const { httpStatusCode, message } = result;

        if (httpStatusCode === 200) {
          res.clearCookie("nodetodo");
        }
        res
          .status(httpStatusCode)
          .json({ httpStatusCode, resultMessage: message });
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
