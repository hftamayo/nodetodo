import { Request, Response } from "express";
import {
  UserRequest,
  UpdateUserRequest,
  UserIdRequest,
  UserResult,
  UserServices,
} from "../../types/user.interface";
import { cors_secure, cors_samesite } from "../../config/envvars";

export default function userController(userService: UserServices) {
  return {
    registerHandler: async function (req: UserRequest, res: Response) {
      try {
        const { httpStatusCode, message, user } = await userService.signUpUser(
          req
        );
        if (httpStatusCode === 200 && user) {
          const { password, ...filteredUser } = user;
          res.status(httpStatusCode).json({
            httpStatusCode,
            resultMessage: message,
            newUser: filteredUser,
          });
        } else {
          res
            .status(httpStatusCode)
            .json({ httpStatusCode, resultMessage: message });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("userController, register: " + error.message);
        } else {
          console.error("userController, register: " + error);
        }
        res
          .status(500)
          .json({
            httpStatusCode: 500,
            resultMessage: "Internal Server Error",
          });
      }
    },

    loginHandler: async function (req: UserRequest, res: Response) {
      try {
        const { httpStatusCode, tokenCreated, message, user } =
          await userService.loginUser(req);

        if (httpStatusCode === 200 && user) {
          res.cookie("nodetodo", tokenCreated, {
            httpOnly: true,
            maxAge: 360000,
            secure: cors_secure, //sent the cookie only if https is enabled
            sameSite: cors_samesite,
            path: "/",
          });
          //filtering password for not showing during the output
          const { password, ...filteredUser } = user;
          res.status(httpStatusCode).json({
            httpStatusCode,
            resultMessage: message,
            loggedUser: filteredUser,
          });
        } else {
          res
            .status(httpStatusCode)
            .json({ httpStatusCode, resultMessage: message });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("userController, login: " + error.message);
        } else {
          console.error("userController, login: " + error);
        }
        res
          .status(500)
          .json({
            httpStatusCode: 500,
            resultMessage: "Internal Server Error",
          });
      }
    },

    logoutHandler: async function (req: Request, res: Response) {
      try {
        res.clearCookie("nodetodo");
        res.status(200).json({
          httpStatusCode: 200,
          resultMessage: "User logged out successfully",
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("userController, logout: " + error.message);
        } else {
          console.error("userController, logout: " + error);
        }
        res
          .status(500)
          .json({
            httpStatusCode: 500,
            resultMessage: "Internal Server Error",
          });
      }
    },

    listUserHandler: async function (req: UserIdRequest, res: Response) {
      try {
        if (!req?.userId) {
          res
            .status(400)
            .json({
              httpStatusCode: 400,
              resultMessage: "Internal Error: User ID is required",
            });
          return;
        } else {
          console.log("el ID del user a listar es: ", req.userId);
        }

        const { httpStatusCode, message, user } =
          await userService.listUserByID(req);
        if (httpStatusCode === 200 && user) {
          const { password, ...filteredUser } = user;
          res.status(httpStatusCode).json({
            httpStatusCode,
            resultMessage: message,
            searchUser: filteredUser,
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
        res
          .status(500)
          .json({
            httpStatusCode: 500,
            resultMessage: "Internal Server Error",
          });
      }
    },

    updateUserDetailsHandler: async function (
      req: UpdateUserRequest,
      res: Response
    ) {
      try {
        if (!req.user) {
          return res.status(400).json({
            httpStatusCode: 400,
            resultMessage: "Invalid request",
          });
        }

        const params: UpdateUserRequest = {
          userId: req.userId,
          user: req.user,
        };

        const { httpStatusCode, message, user } =
          await userService.updateUserDetailsByID(params);

        if (!user) {
          return res
            .status(httpStatusCode)
            .json({ httpStatusCode, resultMessage: message });
        }

        const { password, ...filteredUSer } = user;
        res.status(httpStatusCode).json({
          httpStatusCode,
          resultMessage: message,
          updatedUser: filteredUSer,
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("userController, updateDetails: " + error.message);
        } else {
          console.error("userController, updateDetails: " + error);
        }

        res
          .status(500)
          .json({
            httpStatusCode: 500,
            resultMessage: "Internal Server Error",
          });
      }
    },

    updateUserPasswordHandler: async function (
      req: UpdateUserRequest,
      res: Response
    ) {
      try {
        if (!req.user) {
          return res.status(400).json({
            httpStatusCode: 400,
            resultMessage: "Invalid request",
          });
        }

        const params: UpdateUserRequest = {
          userId: req.userId,
          user: req.user,
        };

        const { httpStatusCode, message, user } =
          await userService.updateUserPasswordByID(params);

        if (!user) {
          return res
            .status(httpStatusCode)
            .json({ httpStatusCode, resultMessage: message });
        }

        const { password, ...filteredUser } = user;
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
        res
          .status(500)
          .json({
            httpStatusCode: 500,
            resultMessage: "Internal Server Error",
          });
      }
    },

    deleteUserHandler: async function (req: UserIdRequest, res: Response) {
      try {
        if (!req) {
          res
            .status(400)
            .json({
              httpStatusCode: 400,
              resultMessage: "User ID is required",
            });
          return;
        }
        const { httpStatusCode, message } = await userService.deleteUserByID(
          req
        );

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
        res
          .status(500)
          .json({
            httpStatusCode: 500,
            resultMessage: "Internal Server Error",
          });
      }
    },
  };
}
