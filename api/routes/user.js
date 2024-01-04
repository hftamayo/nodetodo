const express = require( "express");
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  deleteUser,
} = require( "../controllers/userController.js");
const authorize = require( "../middleware/authorize.js");
const {
  loginRules,
  registerRules,
  updateDetailsRules,
  updatePasswordRules,
} = require( "../middleware/validator.js");
const { validateResult } = require( "../middleware/validationResults.js");

const router = express.Router();

router.post("/register", registerRules, validateResult, register);
router.post("/login", loginRules, validateResult, login);
router.get("/logout", authorize, logout);
router.get("/me", authorize, getMe);
router.put(
  "/updatedetails",
  authorize,
  updateDetailsRules,
  validateResult,
  updateDetails
);
router.put(
  "/updatepassword",
  authorize,
  updatePasswordRules,
  validateResult,
  updatePassword
);
router.delete("/deleteuser", authorize, deleteUser);

module.exports = router;
