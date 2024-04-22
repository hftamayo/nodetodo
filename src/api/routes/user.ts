import express, { Request, Response } from "express";
import userController from "../controllers/userController";
import userService from "../../services/userService";
import authorize from "../middleware/authorize";
import validator from "../middleware/validator";
import validateResult from "../middleware/validationResults";
import rateLimiter from "../middleware/rateLimiter";
import {
  UserRequest,
  UserResult,
  PartialUserRequest,
} from "../../types/user.interface";

const router = express.Router();

userController.setSignUpUser(userService.signUpUser);
userController.setLoginUser(
  userService.loginUser as (
    newLoginUser: UserRequest
  ) => Promise<UserResult>
);
userController.setListUser(
  userService.listUserByID as (
    newListUser: UserRequest
  ) => Promise<UserResult>
);
userController.setUpdateUserDetails(userService.updateUserByID);
userController.setUpdateUserPassword(userService.updateUserPassword);
userController.setDeleteUser(
  userService.deleteUserByID as (
    newDeleteUser: UserId
  ) => Promise<UserResult>
);

const registerHandler = (req: Request, res: Response) => {
  const UserRequest: PartialUserRequest = req.body;
  userController.registerHandler(UserRequest, res);
};

const loginHandler = (req: UserRequest, res: Response) => {
  userController.loginHandler(req, res);
};

const logoutHandler = (req: Request, res: Response) => {
  userController.logoutHandler(req, res);
};

const listUserHandler = (req: Request, res: Response) => {
  userController.listUserHandler(req as unknown as RequestWithUserId, res);
};

const updateUserDetailsHandler = (
  req: PartialUserRequest,
  res: Response
) => {
  userController.updateUserDetailsHandler(req, res);
};

const updateUserPasswordHandler = (
  req: PartialUserRequest,
  res: Response
) => {
  userController.updateUserPasswordHandler(req, res);
};

const deleteUserHandler = (req: Request, res: Response) => {
  userController.deleteUserHandler(req as unknown as PartialUserRequest, res);
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
