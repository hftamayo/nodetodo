import { ValidationChain, check } from "express-validator";

const registerRules: ValidationChain[] = [
  check("name", "Name is Required").notEmpty().trim().escape(),
  check("email", "Please give a valid email").isEmail().normalizeEmail(),
  check(
    "password",
    "Password should be at least 6 or more characters"
  ).isLength({ min: 6 }),
  check("age", "Age is required").notEmpty().trim().escape().isNumeric(),
];

const loginRules: ValidationChain[] = [
  check("email", "Please give a valid Email").isEmail().normalizeEmail(),
  check("password", "Password should be 6 or more characters").isLength({
    min: 6,
  }),
];

const updateDetailsRules: ValidationChain[] = [
  check("name", "Name is Required").notEmpty().trim().escape(),
  check("email", "Please give a valid email").isEmail().normalizeEmail(),
  check("age", "Age is required").notEmpty().trim().escape().isNumeric(),
];

const updatePasswordRules: ValidationChain[] = [
  check(
    "password",
    "Password should be at least 6 or more characters"
  ).isLength({ min: 6 }),
  check(
    "newPassword",
    "Password should be at least 6 or more characters"
  ).isLength({ min: 6 }),
];

const createTodoRules: ValidationChain[] = [
  check("title", "Title is Required").notEmpty().trim().escape(),
  check("description", "Description is Required").notEmpty().trim().escape(),
];

const updateTodoRules: ValidationChain[] = [
  check("title", "Title is Required").notEmpty().trim().escape(),
  check("description", "Description is Required").notEmpty().trim().escape(),
  check("completed", "Completed is Required")
    .notEmpty()
    .trim()
    .escape()
    .isBoolean(),
];

export default {
  registerRules,
  loginRules,
  updateDetailsRules,
  updatePasswordRules,
  createTodoRules,
  updateTodoRules,
};
