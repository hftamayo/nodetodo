import { Request, Response } from "express";
import {
  UserControllerResult,
  UserRequestBody,
  UserId,
  RequestWithUserId,
  RequestWithUserBody,
} from "../../types/user.interface";
const { cors_secure, cors_samesite } = require("./envvars");
let signUpUser: (
  newSignUpUser: UserRequestBody
) => Promise<UserControllerResult>;
let loginUser: (newLoginUser: UserRequestBody) => Promise<UserControllerResult>;
let logoutUser: (
  newLogoutUser: UserRequestBody
) => Promise<UserControllerResult>;
let listUserByID: (newListUser: UserId) => Promise<UserControllerResult>;
let updateUserDetailsByID: (
  userId: UserId,
  newUpdateUserDetails: UserRequestBody
) => Promise<UserControllerResult>;
let updateUserPasswordByID: (
  userId: UserId,
  newUpdateUserPassword: UserRequestBody
) => Promise<UserControllerResult>;
let deleteUserByID: (newDeleteUser: UserId) => Promise<UserControllerResult>;

const userController = {
  setSignUpUser: function (
    newSignUpUser: (
      newSignUpUser: UserRequestBody
    ) => Promise<UserControllerResult>
  ) {
    signUpUser = newSignUpUser;
  },

  setLoginUser: function (newLoginUser: any) {
    loginUser = newLoginUser;
  },
  setLogoutUser: function (newLogoutUser: any) {
    logoutUser = newLogoutUser;
  },

  setListUser: function (
    newListUser: (newListUser: UserId) => Promise<UserControllerResult>
  ) {
    listUserByID = newListUser;
  },
  setUpdateUserDetails: function (newUpdateUserDetails: any) {
    updateUserDetailsByID = newUpdateUserDetails;
  },
  setUpdateUserPassword: function (newUpdateUserPassword: any) {
    updateUserPasswordByID = newUpdateUserPassword;
  },
  setDeleteUser: function (
    newDeleteUser: (newDeleteUser: UserId) => Promise<UserControllerResult>
  ) {
    deleteUserByID = newDeleteUser;
  },

  registerHandler: async function (req: RequestWithUserBody, res: Response) {
    try {
      const { httpStatusCode, message, user } = await signUpUser(req.user);
      if (httpStatusCode === 200) {
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
        .json({ httpStatusCode: 500, resultMessage: "Internal Server Error" });
    }
  },

  loginHandler: async function (req: Request, res: Response) {
    try {
      const { httpStatusCode, tokenCreated, message, user } = await loginUser(
        req.body
      );

      if (httpStatusCode === 200) {
        res.cookie("nodetodo", tokenCreated, {
          httpOnly: true,
          maxAge: 360000,
          secure: cors_secure, //sent the cookie only if https is enabled
          sameSite: cors_samesite,
          path: "/",
        });
        //filtering password for not showing during the output
        const { password, ...filteredUser } = user._doc;
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
        .json({ httpStatusCode: 500, resultMessage: "Internal Server Error" });
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
        .json({ httpStatusCode: 500, resultMessage: "Internal Server Error" });
    }
  },

  listUserHandler: async function (req: RequestWithUserId, res: Response) {
    try {
      const { httpStatusCode, message, user } = await listUserByID(req.user);
      if (httpStatusCode === 200) {
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
        .json({ httpStatusCode: 500, resultMessage: "Internal Server Error" });
    }
  },

  updateUserDetailsHandler: async function (req: Request, res: Response) {
    try {
      const { httpStatusCode, message, user } = await updateUserDetailsByID(
        req.user,
        req.body
      );

      if (!user) {
        return res
          .status(httpStatusCode)
          .json({ httpStatusCode, resultMessage: message });
      }

      const { password, ...filteredUSer } = user._doc;
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
        .json({ httpStatusCode: 500, resultMessage: "Internal Server Error" });
    }
  },

  updateUserPasswordHandler: async function (req: Request, res: Response) {
    try {
      const { httpStatusCode, message, user } = await updateUserPasswordByID(
        req.user,
        req.body
      );

      if (!user) {
        return res
          .status(httpStatusCode)
          .json({ httpStatusCode, resultMessage: message });
      }

      const { password, ...filteredUser } = user._doc;
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
        .json({ httpStatusCode: 500, resultMessage: "Internal Server Error" });
    }
  },

  deleteUserHandler: async function (req: RequestWithUserId, res: Response) {
    try {
      const { httpStatusCode, message } = await deleteUserByID(req.user);

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
        .json({ httpStatusCode: 500, resultMessage: "Internal Server Error" });
    }
  },
};

module.exports = userController;
