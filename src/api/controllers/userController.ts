import { Response } from "express";
import {
  UserRequest,
  UserResult,
  PartialUserRequest,
} from "../../types/user.interface";

import { cors_secure, cors_samesite } from "../../config/envvars";

let signUpUser: (newSignUpUser: UserRequest) => Promise<UserResult>;
let loginUser: (newLoginUser: UserRequest) => Promise<UserResult>;
let logoutUser: (newLogoutUser: UserRequest) => Promise<UserResult>;
let listUserByID: (newListUser: string) => Promise<UserResult>;
let updateUserDetailsByID: (
  params: Partial<UserRequest>
) => Promise<UserResult>;
let updateUserPasswordByID: (
  params: Partial<UserRequest>
) => Promise<UserResult>;
let deleteUserByID: (newDeleteUser: string) => Promise<UserResult>;

const userController = {
  setSignUpUser: function (
    newSignUpUser: (newSignUpUser: UserRequest) => Promise<UserResult>
  ) {
    signUpUser = newSignUpUser;
  },

  setLoginUser: function (
    newLoginUser: (newLoginUser: UserRequest) => Promise<UserResult>
  ) {
    loginUser = newLoginUser;
  },

  setLogoutUser: function (newLogoutUser: any) {
    logoutUser = newLogoutUser;
  },

  setListUser: function (
    newListUser: (newListUser: string) => Promise<UserResult>
  ) {
    listUserByID = newListUser;
  },

  setUpdateUserDetails: function (
    newUpdateUserDetails: (params: Partial<UserRequest>) => Promise<UserResult>
  ) {
    updateUserDetailsByID = newUpdateUserDetails;
  },

  setUpdatePassword: function (
    newUpdateUserPassword: (params: Partial<UserRequest>) => Promise<UserResult>
  ) {
    updateUserPasswordByID = newUpdateUserPassword;
  },

  setDeleteUser: function (
    newDeleteUser: (newDeleteUser: string) => Promise<UserResult>
  ) {
    deleteUserByID = newDeleteUser;
  },

  registerHandler: async function (req: PartialUserRequest, res: Response) {
    try {
      const { httpStatusCode, message, user } = await signUpUser(
        req.user as UserRequest
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
        .json({ httpStatusCode: 500, resultMessage: "Internal Server Error" });
    }
  },

  loginHandler: async function (req: PartialUserRequest, res: Response) {
    try {
      const { httpStatusCode, tokenCreated, message, user } = await loginUser(
        req.user as UserRequest
      );

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
        .json({ httpStatusCode: 500, resultMessage: "Internal Server Error" });
    }
  },

  logoutHandler: async function (req: Partial<UserRequest>, res: Response) {
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

  listUserHandler: async function (req: PartialUserRequest, res: Response) {
    try {
      if (!req.userId) {
        res
          .status(400)
          .json({ httpStatusCode: 400, resultMessage: "User ID is required" });
        return;
      }

      const { httpStatusCode, message, user } = await listUserByID(req.userId);
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
        .json({ httpStatusCode: 500, resultMessage: "Internal Server Error" });
    }
  },

  updateUserDetailsHandler: async function (
    req: PartialUserRequest,
    res: Response
  ) {
    try {
      if (!req.user) {
        return res.status(400).json({
          httpStatusCode: 400,
          resultMessage: "Invalid request",
        });
      }

      const params: PartialUserRequest = {
        userId: req.userId,
        user: req.user,
      };

      const { httpStatusCode, message, user } = await updateUserDetailsByID(
        params
      );

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
        .json({ httpStatusCode: 500, resultMessage: "Internal Server Error" });
    }
  },

  updateUserPasswordHandler: async function (
    req: PartialUserRequest,
    res: Response
  ) {
    try {
      if (!req.user) {
        return res.status(400).json({
          httpStatusCode: 400,
          resultMessage: "Invalid request",
        });
      }

      const params: PartialUserRequest = {
        userId: req.userId,
        user: req.user,
      };

      const { httpStatusCode, message, user } = await updateUserPasswordByID(
        params
      );

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
        .json({ httpStatusCode: 500, resultMessage: "Internal Server Error" });
    }
  },

  deleteUserHandler: async function (req: PartialUserRequest, res: Response) {
    try {
      if (!req.userId) {
        res
          .status(400)
          .json({ httpStatusCode: 400, resultMessage: "User ID is required" });
        return;
      }
      const { httpStatusCode, message } = await deleteUserByID(req.userId);

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

export default userController;
