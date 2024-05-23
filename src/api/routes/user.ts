import express, { Request, Response } from "express";
import userController from "../controllers/userController";
import authorize from "../middleware/authorize";
import validator from "../middleware/validator";
import validateResult from "../middleware/validationResults";
import rateLimiter from "../middleware/rateLimiter";
import {
  UserRequest,
  LoginRequest,
  UserIdRequest,
  UpdateUserRequest,
  UserServices
} from "../../types/user.interface";


const router = express.Router();

const controller = userController({} as UserServices);

const registerHandler = (req: Request, res: Response) => {
  const userRequest: UserRequest = req.body;
  controller.registerHandler(userRequest, res);
};

const loginHandler = (req: Request, res: Response) => {
  const loginRequest: LoginRequest = req.body;
  controller.loginHandler(loginRequest, res);
};

const logoutHandler = (req: Request, res: Response) => {
  controller.logoutHandler(req, res);
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

router.post(
  "/register",
  rateLimiter.signUpLimiter,
  validator.registerRules,
  validateResult,
  registerHandler
);
router.post(
  "/login",
  rateLimiter.loginLimiter,
  validator.loginRules,
  validateResult,
  loginHandler
);
router.post("/logout", authorize, logoutHandler);
router.get("/me", authorize, listUserHandler);
router.put(
  "/updatedetails",
  authorize,
  validator.updateDetailsRules,
  validateResult,
  updateUserDetailsHandler
);
router.put(
  "/updatepassword",
  authorize,
  validator.updatePasswordRules,
  validateResult,
  updateUserPasswordHandler
);
router.delete("/deleteuser", authorize, deleteUserHandler);

export default router;
