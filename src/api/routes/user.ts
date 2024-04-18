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
  UserControllerResult,
  UserUpdateControllerResult,
} from "../../types/user.interface";

const router = express.Router();

userController.setSignUpUser(userService.signUpUser);
userController.setLoginUser(userService.loginUser);
userController.setListUser(userService.listUserByID);
userController.setUpdateUserDetails(userService.updateUserByID);
userController.setUpdateUserPassword(userService.updateUserPassword);
userController.setDeleteUser(userService.deleteUserByID as (newDeleteUser: UserId) => Promise<UserControllerResult>);

const registerHandler = (req: RequestWithUserBody, res: Response) => {
  userController.registerHandler(req, res);
};

const loginHandler = (req: RequestWithUserBody, res: Response) => {
  userController.loginHandler(req, res);
};

const logoutHandler = (req: Request, res: Response) => {
  userController.logoutHandler(req, res);
};

const listUserHandler = (req: RequestWithUserId, res: Response) => {
  userController.listUserHandler(req, res);
};

const updateUserDetailsHandler = (req: UpdateUserDetailsParams, res: Response) => {
  userController.updateUserDetailsHandler(req, res);
};

const updateUserPasswordHandler = (req: UpdateUserPasswordParams, res: Response) => {
  userController.updateUserPasswordHandler(req, res);
};

const deleteUserHandler = (req: RequestWithUserId, res: Response) => {
  userController.deleteUserHandler(req, res);
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
