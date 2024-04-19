import express, {Request, Response} from "express";
import userController from "../controllers/userController";
import userService from "../../services/userService";
import authorize from "../middleware/authorize";
import validator from "../middleware/validator";
import validateResult from "../middleware/validationResults";
import rateLimiter from "../middleware/rateLimiter";
import {
  UserId,
  UserRequestBody,
  RequestWithUserId,
  RequestWithUserBody,
  UpdateUserDetailsParams,
  UpdateUserPasswordParams,
  BasedUserControllerResult,
  DeleteUserControllerResult,
} from "../../types/user.interface";

const router = express.Router();

userController.setSignUpUser(userService.signUpUser);
userController.setLoginUser(userService.loginUser as (newLoginUser: UserRequestBody) => Promise<UserControllerResult>);
userController.setListUser(userService.listUserByID as (newListUser: UserId) => Promise<BasedUserControllerResult>);
userController.setUpdateUserDetails(userService.updateUserByID);
userController.setUpdateUserPassword(userService.updateUserPassword);
userController.setDeleteUser(userService.deleteUserByID as (newDeleteUser: UserId) => Promise<DeleteUserControllerResult>);

const registerHandler = (req: RequestWithUserBody, res: Response) => {
  userController.registerHandler(req, res);
};

const loginHandler = (req: RequestWithUserBody, res: Response) => {
  userController.loginHandler(req, res);
};

const logoutHandler = (req: Request, res: Response) => {
  userController.logoutHandler(req, res);
};

const listUserHandler = (req: Request, res: Response) => {
  userController.listUserHandler(req as unknown as RequestWithUserId, res);
};

const updateUserDetailsHandler = (req: UpdateUserDetailsParams, res: Response) => {
  userController.updateUserDetailsHandler(req, res);
};

const updateUserPasswordHandler = (req: UpdateUserPasswordParams, res: Response) => {
  userController.updateUserPasswordHandler(req, res);
};

const deleteUserHandler = (req: Request, res: Response) => {
  userController.deleteUserHandler(req as unknown as RequestWithUserId, res);
};

router.post(
  "/register",
  rateLimiter.signUpLimiter,
  validator.registerRules,
  validateResult,
  registerHandler
);
router.post("/login", rateLimiter.loginLimiter, validator.loginRules, validateResult, loginHandler);
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
