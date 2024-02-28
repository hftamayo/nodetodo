const express = require("express");
const userController = require("../controllers/userController");
const {
  signUpUser,
  loginUser,
  listUserByID,
  updateUserByID,
  updateUserPassword,
  deleteUserByID,
} = require("../../services/userService");
const authorize = require("../middleware/authorize");
const {
  loginRules,
  registerRules,
  updateDetailsRules,
  updatePasswordRules,
} = require("../middleware/validator");
const { validateResult } = require("../middleware/validationResults");
const { signUpLimiter, loginLimiter } = require("../middleware/rateLimiter");
const router = express.Router();

userController.setSignUpUser(signUpUser);
userController.setLoginUser(loginUser);
userController.setListUser(listUserByID);
userController.setUpdateUserDetails(updateUserByID);
userController.setUpdateUserPassword(updateUserPassword);
userController.setDeleteUser(deleteUserByID);

const registerHandler = (req, res) => {
  userController.registerHandler(req, res);
};

const loginHandler = (req, res) => {
  userController.loginHandler(req, res);
};

const logoutHandler = (req, res) => {
  userController.logoutHandler(req, res);
};

const listUserHandler = (req, res) => {
  userController.listUserHandler(req, res);
};

const updateUserDetailsHandler = (req, res) => {
  userController.updateUserDetailsHandler(req, res);
};

const updateUserPasswordHandler = (req, res) => {
  userController.updateUserPasswordHandler(req, res);
};

const deleteUserHandler = (req, res) => {
  userController.deleteUserHandler(req, res);
};

router.post("/register", signUpLimiter, registerRules, validateResult, registerHandler);
router.post("/login", loginLimiter, loginRules, validateResult, loginHandler);
router.post("/logout", authorize, logoutHandler);
router.get("/me", authorize, listUserHandler);
router.put(
  "/updatedetails",
  authorize,
  updateDetailsRules,
  validateResult,
  updateUserDetailsHandler
);
router.put(
  "/updatepassword",
  authorize,
  updatePasswordRules,
  validateResult,
  updateUserPasswordHandler
);
router.delete("/deleteuser", authorize, deleteUserHandler);

module.exports = router;
