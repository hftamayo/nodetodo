import express, { Request, Response } from "express";
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
import { DOMAINS, PERMISSIONS } from "../../config/envvars";

const roleRouter = express.Router();

const controller = roleController(roleService as RoleServices);

const getRolesHandler = (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const listRolesRequest: ListRolesRequest = {
    page,
    limit,
  };

  controller.getRolesHandler(listRolesRequest, res);
};

const getRoleHandler = (req: Request, res: Response) => {
  const roleRequest = req as unknown as RoleIdRequest;
  roleRequest.roleId = req.params.id;
  controller.getRoleHandler(roleRequest, res);
};

const newRoleHandler = (req: Request, res: Response) => {
  const newRoleRequest = req.body as NewRoleRequest;

  controller.newRoleHandler(newRoleRequest, res);
};

const updateRoleHandler = (req: Request, res: Response) => {
  const updateRoleRequest = req.body as UpdateRoleRequest;
  updateRoleRequest.roleId = req.params.id;

  controller.updateRoleHandler(updateRoleRequest, res);
};

const deleteRoleHandler = (req: Request, res: Response) => {
  const roleRequest = req as unknown as RoleIdRequest;
  roleRequest.roleId = req.params.id;

  controller.deleteRoleHandler(roleRequest, res);
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
roleRouter.put(
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
