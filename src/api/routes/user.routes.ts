import express, { Request, Response } from "express";
import userController from "../controllers/userController";
import userService from "../../services/userService";
import authorize from "../middleware/authorize";
import validator from "../middleware/validator";
import validateResult from "../middleware/validationResults";
import rateLimiter from "../middleware/rateLimiter";
import {
  AuthenticatedUserRequest,
  SignUpRequest,
  LoginRequest,
  UpdateUserRequest,
  UserServices,
} from "../../types/user.types";
import { DOMAINS, SYSTEM_PERMISSIONS, PERMISSIONS } from "../../config/envvars";

const userRouter = express.Router();

const controller = userController(userService as UserServices);

const registerHandler = (req: Request, res: Response) => {
  const userRequest: SignUpRequest = req.body;
  controller.signUpHandler(userRequest, res);
};

const loginHandler = (req: Request, res: Response) => {
  const loginRequest: LoginRequest = req.body;
  controller.loginHandler(loginRequest, res);
};

const logoutHandler = (req: AuthenticatedUserRequest, res: Response) => {
  controller.logoutHandler(req, res);
};

const listUsersHandler = (req: AuthenticatedUserRequest, res: Response) => {
  controller.listUsersHandler(req, res);
};

const listUserHandler = (req: AuthenticatedUserRequest, res: Response) => {
  controller.listUserHandler(req, res);
};

const updateUserDetailsHandler = (
  req: AuthenticatedUserRequest,
  res: Response
) => {
  const updateUserRequest: UpdateUserRequest = {
    userId: req.user?.id ?? "",
    user: req.body,
  };
  controller.updateUserDetailsHandler(updateUserRequest, res);
};

const updateUserPasswordHandler = (
  req: AuthenticatedUserRequest,
  res: Response
) => {
  const updateUserRequest: UpdateUserRequest = {
    userId: req.user?.id ?? "",
    user: req.body,
  };
  controller.updateUserPasswordHandler(updateUserRequest, res);
};

const deleteUserHandler = (req: AuthenticatedUserRequest, res: Response) => {
  controller.deleteUserHandler(req, res);
};

userRouter.post(
  "/register",
  rateLimiter.signUpLimiter,
  validator.registerRules,
  validateResult,
  registerHandler
);
userRouter.post(
  "/login",
  rateLimiter.loginLimiter,
  validator.loginRules,
  validateResult,
  loginHandler
);
userRouter.post(
  "/logout",
  authorize(DOMAINS.SYSTEM, SYSTEM_PERMISSIONS.LOGOUT),
  logoutHandler
);
userRouter.get(
  "/list",
  authorize(DOMAINS.USER, PERMISSIONS.READ),
  listUsersHandler
);
userRouter.get(
  "/me",
  authorize(DOMAINS.USER, PERMISSIONS.READ),
  listUserHandler
);
userRouter.patch(
  "/updatedetails",
  authorize(DOMAINS.USER, PERMISSIONS.UPDATE),
  validator.updateDetailsRules,
  validateResult,
  updateUserDetailsHandler
);
userRouter.put(
  "/updatepassword",
  authorize(DOMAINS.USER, PERMISSIONS.UPDATE),
  validator.updatePasswordRules,
  validateResult,
  updateUserPasswordHandler
);
userRouter.delete(
  "/delete",
  authorize(DOMAINS.USER, PERMISSIONS.DELETE),
  deleteUserHandler
);

export default userRouter;
