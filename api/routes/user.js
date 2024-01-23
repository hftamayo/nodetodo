const express = require("express");
const userController = require("../controllers/userController");
const { signUpUser } = require("../../services/userService");
const authorize = require("../middleware/authorize");
const {
  loginRules,
  registerRules,
  updateDetailsRules,
  updatePasswordRules,
} = require("../middleware/validator");
const { validateResult } = require("../middleware/validationResults");

const router = express.Router();

userController.setSignUpUser(signUpUser);

const registerHandler = (req, res) => {
  userController.registerHandler(req, res);
};

router.post("/register", registerRules, validateResult, registerHandler);
// router.post("/login", loginRules, validateResult, login);
// router.get("/logout", authorize, logout);
// router.get("/me", authorize, getMe);
// router.put(
//   "/updatedetails",
//   authorize,
//   updateDetailsRules,
//   validateResult,
//   updateDetails
// );
// router.put(
//   "/updatepassword",
//   authorize,
//   updatePasswordRules,
//   validateResult,
//   updatePassword
// );
// router.delete("/deleteuser", authorize, deleteUser);

module.exports = router;
