const { check } = require("express-validator");

const registerRules = [
  check("name", "Name is Required").notEmpty().trim().escape(),
  check("email", "Please give a valid email").isEmail().normalizeEmail(),
  check(
    "password",
    "Password should be at least 6 or more characters"
  ).isLength({ min: 6 }),
  check("age", "Age is required").notEmpty().trim().escape().isNumeric(),
];

const loginRules = [
  check("email", "Please give a valid Email").isEmail().normalizeEmail(),
  check("password", "Password should be 6 or more characters").isLength({
    min: 6,
  }),
];

const updateDetailsRules = [
  check("name", "Name is Required").notEmpty().trim().escape(),
  check("email", "Please give a valid email").isEmail().normalizeEmail(),
  check("age", "Age is required").notEmpty().trim().escape().isNumeric(),
];

const updatePasswordRules = [
  check(
    "password",
    "Password should be at least 6 or more characters"
  ).isLength({ min: 6 }),
  check(
    "newPassword",
    "Password should be at least 6 or more characters"
  ).isLength({ min: 6 }),
];

const createTodoRules = [
  check("title", "Title is Required").notEmpty().trim().escape(),
  check("description", "Description is Required").notEmpty().trim().escape(),
];

const updateTodoRules = [
  check("title", "Title is Required").notEmpty().trim().escape(),
  check("description", "Description is Required").notEmpty().trim().escape(),
  check("completed", "Completed is Required")
    .notEmpty()
    .trim()
    .escape()
    .isBoolean(),
];

module.exports = {
  registerRules,
  loginRules,
  updateDetailsRules,
  updatePasswordRules,
  createTodoRules,
  updateTodoRules,
};