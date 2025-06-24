import { ValidationChain, check } from "express-validator";

const createRoleRules: ValidationChain[] = [
  check("role.name", "Name is Required").notEmpty().trim().escape(),
  check("role.description", "Description is Required")
    .notEmpty()
    .trim()
    .escape(),
  check("role.status", "Status is Required")
    .notEmpty()
    .trim()
    .escape()
    .isBoolean(),
  check("role.permissions", "Permissions is Required").notEmpty().isArray(),
];

const updateRoleRules: ValidationChain[] = [
  check("role.name", "Name is Required").optional().notEmpty().trim().escape(),
  check("role.description", "Description is Required")
    .optional()
    .notEmpty()
    .trim()
    .escape(),
  check("role.status", "Status is Required")
    .optional()
    .notEmpty()
    .trim()
    .escape()
    .isBoolean(),
  check("role.permissions", "Permissions is Required")
    .optional()
    .notEmpty()
    .isArray(),
];

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
  check("user").exists().withMessage("User object is required"),
  check("user.name", "Name is Required").notEmpty().trim().escape(),
  check("user.email", "Please give a valid email").isEmail().normalizeEmail(),
  check("user.age", "Age is required").notEmpty().isNumeric(),
  check("user.age")
    .isInt({ min: 18, max: 100 })
    .withMessage("Age should be between 18 and 100"),
];

const updatePasswordRules: ValidationChain[] = [
  check("user").exists().withMessage("User object is required"),
  check(
    "user.password",
    "Password should be at least 6 or more characters"
  ).isLength({ min: 6 }),
  check(
    "user.newPassword",
    "Password should be at least 6 or more characters"
  ).isLength({ min: 6 }),
];

const createTodoRules: ValidationChain[] = [
  check("title", "Title is Required").notEmpty().trim().escape(),
  check("description", "Description is Required").notEmpty().trim().escape(),
];

const updateTodoRules: ValidationChain[] = [
  check("title", "Title is Required").optional().notEmpty().trim().escape(),
  check("description", "Description is Required")
    .optional()
    .notEmpty()
    .trim()
    .escape(),
  check("completed", "Completed is Required")
    .optional()
    .notEmpty()
    .trim()
    .escape()
    .isBoolean(),
];

export default {
  createRoleRules,
  updateRoleRules,
  registerRules,
  loginRules,
  updateDetailsRules,
  updatePasswordRules,
  createTodoRules,
  updateTodoRules,
};
