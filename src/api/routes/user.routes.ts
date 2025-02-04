import express, { Request, Response } from "express";
import userController from "../controllers/userController";
import userService from "../../services/userService";
import authorize from "../middleware/authorize";
import validator from "../middleware/validator";
import validateResult from "../middleware/validationResults";
import rateLimiter from "../middleware/rateLimiter";
import {
  UserRequest,
  LoginRequest,
  UserIdRequest,
  UpdateUserRequest,
  UserServices,
} from "../../types/user.types";

const userRouter = express.Router();

const controller = userController(userService as UserServices);

const registerHandler = (req: Request, res: Response) => {
  const userRequest: UserRequest = req.body;
  controller.signUpHandler(userRequest, res);
};

const loginHandler = (req: Request, res: Response) => {
  const loginRequest: LoginRequest = req.body;
  controller.loginHandler(loginRequest, res);
};

const logoutHandler = (req: Request, res: Response) => {
  controller.logoutHandler(req, res);
};

const listUsersHandler = (req: Request, res: Response) => {
  controller.listUsersHandler(req, res);
};

const listUserHandler = (req: Request, res: Response) => {
  const userIdRequest: UserIdRequest = { userId: req.body.userId };
  controller.listUserHandler(userIdRequest, res);
};

const updateUserDetailsHandler = (req: Request, res: Response) => {
  const updateUserRequest: UpdateUserRequest = req.body;
  controller.updateUserDetailsHandler(updateUserRequest, res);
};

const updateUserPasswordHandler = (req: Request, res: Response) => {
  const updateUserRequest: UpdateUserRequest = req.body;
  controller.updateUserPasswordHandler(updateUserRequest, res);
};

const deleteUserHandler = (req: Request, res: Response) => {
  const userIdRequest: UserIdRequest = { userId: req.body.userId };
  controller.deleteUserHandler(userIdRequest, res);
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
userRouter.post("/logout", authorize, logoutHandler);
userRouter.get("/list", authorize, listUsersHandler);
userRouter.get("/me", authorize, listUserHandler);
userRouter.put(
  "/updatedetails",
  authorize,
  validator.updateDetailsRules,
  validateResult,
  updateUserDetailsHandler
);
userRouter.put(
  "/updatepassword",
  authorize,
  validator.updatePasswordRules,
  validateResult,
  updateUserPasswordHandler
);
userRouter.delete("/delete", authorize, deleteUserHandler);

export default userRouter;
