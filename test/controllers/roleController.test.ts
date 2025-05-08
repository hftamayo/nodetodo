import { Response } from "express";
import {
  RoleServices,
  ListRolesRequest,
  RoleIdRequest,
  NewRoleRequest,
  UpdateRoleRequest,
  ListRolesResponse,
  ListRoleResponse,
  CreateRoleResponse,
  UpdateRoleResponse,
  DeleteRoleResponse,
} from "@/types/role.types";
import roleController from "@/api/controllers/roleController";
import { mockRolesData } from "@test/mocks/role.mock";

describe("Role Controller - Unit Tests", () => {
  let req: ListRolesRequest;
  let res: Response;
  let listRolesStub: jest.Mock;
  let listRoleByIDStub: jest.Mock;
  let createRoleStub: jest.Mock;
  let updateRoleStub: jest.Mock;
  let deleteRoleStub: jest.Mock;
  let controller: ReturnType<typeof roleController>;
  let mockRoleService: RoleServices;

  beforeEach(() => {
    // Response setup
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Stub implementations
    listRolesStub = jest.fn().mockImplementation((params) => {
      if (params.page && params.limit) {
        return Promise.resolve({
          httpStatusCode: 200,
          message: "ROLES_FOUND",
          roles: mockRolesData,
        });
      }
      return Promise.resolve({
        httpStatusCode: 404,
        message: "ROLES_NOT_FOUND",
      });
    });

    listRoleByIDStub = jest.fn().mockImplementation((params) => {
      if (params.roleId === mockRolesData[0]._id.toString()) {
        return Promise.resolve({
          httpStatusCode: 200,
          message: "ENTITY_FOUND",
          role: mockRolesData[0],
        });
      }
      return Promise.resolve({
        httpStatusCode: 404,
        message: "ENTITY_NOT_FOUND",
      });
    });

    createRoleStub = jest.fn().mockImplementation((params) => {
      if (params.role.name === mockRolesData[0].name) {
        return Promise.resolve({
          httpStatusCode: 400,
          message: "ROLE_ALREADY_EXISTS",
        });
      }
      return Promise.resolve({
        httpStatusCode: 201,
        message: "ROLE_CREATED",
        role: params.role,
      });
    });

    updateRoleStub = jest.fn().mockImplementation((params) => {
      if (params.role._id === mockRolesData[0]._id.toString()) {
        return Promise.resolve({
          httpStatusCode: 200,
          message: "ROLE_UPDATED",
          role: params.role,
        });
      }
      return Promise.resolve({
        httpStatusCode: 404,
        message: "ENTITY_NOT_FOUND",
      });
    });

    deleteRoleStub = jest.fn().mockImplementation((params) => {
      if (params.roleId === mockRolesData[0]._id.toString()) {
        return Promise.resolve({
          httpStatusCode: 200,
          message: "ENTITY_DELETED",
        });
      }
      return Promise.resolve({
        httpStatusCode: 404,
        message: "ENTITY_NOT_FOUND",
      });
    });

    // Service setup
    mockRoleService = {
      listRoles: listRolesStub,
      listRoleByID: listRoleByIDStub,
      createRole: createRoleStub,
      updateRoleByID: updateRoleStub,
      deleteRoleByID: deleteRoleStub,
    };

    controller = roleController(mockRoleService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getRolesHandler", () => {
    it("should return roles list when found", async () => {
      // Arrange
      const req = {
        page: 1,
        limit: 10,
      };

      // Act
      await controller.getRolesHandler(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        resultMessage: "ROLES_FOUND",
        roles: mockRolesData,
      });
      expect(listRolesStub).toHaveBeenCalledWith(req);
    });

    it("should return 404 when no roles found", async () => {
      // Arrange
      const req = {
        page: 0, // Invalid page to trigger 404
        limit: 10,
      };

      // Act
      await controller.getRolesHandler(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: 404,
        resultMessage: "ROLES_NOT_FOUND",
      });
      expect(listRolesStub).toHaveBeenCalledWith(req);
    });

    it("should handle service errors", async () => {
      // Arrange
      const req = {
        page: 1,
        limit: 10,
      };
      listRolesStub.mockRejectedValueOnce(new Error("Database error"));

      // Act
      await controller.getRolesHandler(req, res);

      // Assert
      const consoleErrorSpy = jest.spyOn(console, "error");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("roleController, getRoles:")
      );
    });
  });
});
