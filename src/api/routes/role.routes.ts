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
  const newRoleRequest: NewRoleRequest = {
    role: {
      name: req.body.name,
      description: req.body.description,
      permissions: req.body.permissions,
    },
  };

  controller.newRoleHandler(newRoleRequest, res);
};

const updateRoleHandler = (req: AuthenticatedUserRequest, res: Response) => {
  const updateRoleRequest: UpdateRoleRequest = {
    role: {
      _id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      permissions: req.body.permissions,
    },
  };
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
  getRolesHandler
);
roleRouter.get(
  "/role/:id",
  authorize(DOMAINS.ROLE, PERMISSIONS.READ),
  getRoleHandler
);
roleRouter.post(
  "/create",
  authorize(DOMAINS.ROLE, PERMISSIONS.WRITE),
  validator.createRoleRules,
  validateResult,
  newRoleHandler
);
roleRouter.patch(
  "/update/:id",
  authorize(DOMAINS.ROLE, PERMISSIONS.UPDATE),
  validator.updateRoleRules,
  validateResult,
  updateRoleHandler
);
roleRouter.delete(
  "/delete/:id",
  authorize(DOMAINS.ROLE, PERMISSIONS.DELETE),
  deleteRoleHandler
);

export default roleRouter;
