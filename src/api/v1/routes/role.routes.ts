import express, { Response } from "express";
import authorize from "@/api/v1/middleware/authorize";
import validator from "@/api/v1/middleware/validator";
import validateResult from "@/api/v1/middleware/validationResults";
import { supervisorLimiter } from "@/api/v1/middleware/ratelimit";
import roleService from "@services/roleService";
import roleController from "@/api/v1/controllers/roleController";
import {
  ListRolesRequest,
  RoleIdRequest,
  NewRoleRequest,
  UpdateRoleRequest,
  RoleServices,
} from "@/types/role.types";

import { AuthenticatedUserRequest } from "@/types/user.types";
import { DOMAINS, PERMISSIONS } from "@config/envvars";

const roleRouter = express.Router();

const controller = roleController(roleService as unknown as RoleServices);

const getRolesHandler = (req: AuthenticatedUserRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const cursor = req.query.cursor as string | undefined;
  const sort = req.query.sort as string | undefined;
  const order = (req.query.order as "asc" | "desc") || undefined;
  let filters: Record<string, any> | undefined = undefined;
  if (req.query.filters) {
    try {
      filters =
        typeof req.query.filters === "string"
          ? JSON.parse(req.query.filters)
          : req.query.filters;
    } catch {
      filters = undefined;
    }
  }

  const listRolesRequest: ListRolesRequest = {
    page,
    limit,
    cursor,
    sort,
    order,
    filters,
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
  supervisorLimiter,
  authorize(DOMAINS.ROLE, PERMISSIONS.READ),
  getRolesHandler
);
roleRouter.get(
  "/role/:id",
  supervisorLimiter,
  authorize(DOMAINS.ROLE, PERMISSIONS.READ),
  getRoleHandler
);
roleRouter.post(
  "/create",
  supervisorLimiter,
  authorize(DOMAINS.ROLE, PERMISSIONS.WRITE),
  validator.createRoleRules,
  validateResult,
  newRoleHandler
);
roleRouter.patch(
  "/update/:id",
  supervisorLimiter,
  authorize(DOMAINS.ROLE, PERMISSIONS.UPDATE),
  validator.updateRoleRules,
  validateResult,
  updateRoleHandler
);
roleRouter.delete(
  "/delete/:id",
  supervisorLimiter,
  authorize(DOMAINS.ROLE, PERMISSIONS.DELETE),
  deleteRoleHandler
);

export default roleRouter;
