import express, { Response } from "express";
import authorize from "../middleware/authorize";
import validator from "../middleware/validator";
import validateResult from "../middleware/validationResults";
import roleService from "../../services/roleService";
import roleController from "../controllers/roleController";
import {
  ListRolesRequest,
  RoleIdRequest,
  NewRoleRequest,
  UpdateRoleRequest,
  RoleServices,
} from "../../types/role.types";
import { AuthenticatedUserRequest } from "../../types/user.types";
import { DOMAINS, PERMISSIONS } from "../../config/envvars";
import validateAuthentication from "../middleware/validateAuth";

const roleRouter = express.Router();

const controller = roleController(roleService as RoleServices);

const getRolesHandler = (req: AuthenticatedUserRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const listRolesRequest: ListRolesRequest = {
    page,
    limit,
  };

  controller.getRolesHandler(listRolesRequest, res);
};

const getRoleHandler = (req: AuthenticatedUserRequest, res: Response) => {
  const listRoleByRequest: RoleIdRequest = {
    roleId: req.params.id,
  };
  controller.getRoleHandler(listRoleByRequest, res);
};

const newRoleHandler = (req: AuthenticatedUserRequest, res: Response) => {
  const newRoleRequest = req.body as NewRoleRequest;

  controller.newRoleHandler(newRoleRequest, res);
};

const updateRoleHandler = (req: AuthenticatedUserRequest, res: Response) => {
  const updateRoleRequest = req.body as UpdateRoleRequest;
  updateRoleRequest.roleId = req.params.id;

  controller.updateRoleHandler(updateRoleRequest, res);
};

const deleteRoleHandler = (req: AuthenticatedUserRequest, res: Response) => {
  const listRoleByRequest: RoleIdRequest = {
    roleId: req.params.id,
  };
  controller.deleteRoleHandler(listRoleByRequest, res);
};

roleRouter.get(
  "/list",
  authorize(DOMAINS.ROLE, PERMISSIONS.READ),
  validateAuthentication,
  getRolesHandler
);
roleRouter.get(
  "/role/:id",
  authorize(DOMAINS.ROLE, PERMISSIONS.READ),
  validateAuthentication,
  getRoleHandler
);
roleRouter.post(
  "/create",
  authorize(DOMAINS.ROLE, PERMISSIONS.WRITE),
  validateAuthentication,
  validator.createRoleRules,
  validateResult,
  newRoleHandler
);
roleRouter.put(
  "/update/:id",
  authorize(DOMAINS.ROLE, PERMISSIONS.UPDATE),
  validateAuthentication,
  validator.updateRoleRules,
  validateResult,
  updateRoleHandler
);
roleRouter.delete(
  "/delete/:id",
  authorize(DOMAINS.ROLE, PERMISSIONS.DELETE),
  validateAuthentication,
  deleteRoleHandler
);

export default roleRouter;
