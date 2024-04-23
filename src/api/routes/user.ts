import express, { Request, Response } from "express";
import userController from "../controllers/userController";
import userService from "../../services/userService";
import authorize from "../middleware/authorize";
import validator from "../middleware/validator";
import validateResult from "../middleware/validationResults";
import rateLimiter from "../middleware/rateLimiter";
import {
  UserRequest,
  UserIdRequest,
  UserResult,
  UpdateUserRequest,
} from "../../types/user.interface";

const router = express.Router();

userController.setSignUpUser(userService.signUpUser);
userController.setLoginUser(
  userService.loginUser as (newLoginUser: UserRequest) => Promise<UserResult>
);
userController.setListUser(
  userService.listUserByID as (
    newListUser: UserIdRequest
  ) => Promise<UserResult>
);

userController.setUpdateUserDetails((params: Partial<UserRequest>) => {
  if ("userId" in params && "user" in params) {
    return userService.updateUserByID(
      params.userId as string,
      params.user as Partial<UserRequest>
    );
  } else {
    throw new Error("Invalid parameters");
  }
});

userController.setUpdatePassword((params: Partial<UserRequest>) => {
  if ("userId" in params && "user" in params) {
    return userService.updateUserByID(
      params.userId as string,
      params.user as Partial<UserRequest>
    );
  } else {
    throw new Error("Invalid parameters");
  }
});

const registerHandler = (req: Request, res: Response) => {
  const UserRequest: UserRequest = req.body;
  userController.registerHandler(UserRequest, res);
};

const loginHandler = (req: Request, res: Response) => {
  const UserRequest: UserRequest = req.body;
  userController.loginHandler(UserRequest, res);
};

const logoutHandler = (req: Request, res: Response) => {
  userController.logoutHandler(req, res);
};

const listUserHandler = (req: Request, res: Response) => {
  const userIdRequest: UserIdRequest = { userId: req.body.userId };
  userController.listUserHandler(userIdRequest, res);
};

const updateUserDetailsHandler = (req: Request, res: Response) => {
  userController.updateUserDetailsHandler(req as unknown as UpdateUserRequest, res);
};

const updateUserPasswordHandler = (req: Request, res: Response) => {
  userController.updateUserPasswordHandler(req as unknown as UpdateUserRequest, res);
};

const deleteUserHandler = (req: Request, res: Response) => {
  const userIdRequest: UserIdRequest = { userId: req.body.userId };
  userController.deleteUserHandler(userIdRequest, res);
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
