import { Response } from "express";
import { RoleServices, ListRolesRequest } from "@/types/role.types";
import roleController from "@/api/controllers/roleController";
import { mockRolesData } from "../mocks/role.mock";

type MockedRoleServices = {
  [K in keyof RoleServices]: jest.Mock<
    ReturnType<RoleServices[K]>,
    Parameters<RoleServices[K]>
  >;
};

// Factory function to create mock response
const createMockResponse = () =>
  ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response);

// Factory function to create mock role service
const createMockRoleService = (
  overrides: Partial<MockedRoleServices> = {}
): MockedRoleServices => {
  const defaultService: MockedRoleServices = {
    listRoles: jest.fn().mockImplementation((params) => {
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
    }),
    listRoleByID: jest.fn().mockImplementation((params) => {
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
    }),
    createRole: jest.fn().mockImplementation((params) => {
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
    }),
    updateRoleByID: jest.fn().mockImplementation((params) => {
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
    }),
    deleteRoleByID: jest.fn().mockImplementation((params) => {
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
    }),
  };

  return { ...defaultService, ...overrides };
};

describe("Role Controller - Unit Tests", () => {
  let req: ListRolesRequest;
  let res: Response;
  let mockRoleService: MockedRoleServices;
  let controller: ReturnType<typeof roleController>;

  beforeEach(() => {
    res = createMockResponse();
    mockRoleService = createMockRoleService();
    controller = roleController(mockRoleService as unknown as RoleServices);
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
      expect(mockRoleService.listRoles).toHaveBeenCalledWith(req);
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
      expect(mockRoleService.listRoles).toHaveBeenCalledWith(req);
    });

    it("should handle service errors", async () => {
      // Arrange
      const req = {
        page: 1,
        limit: 10,
      };
      mockRoleService.listRoles.mockRejectedValueOnce(
        new Error("Database error")
      );

      // Act
      await controller.getRolesHandler(req, res);

      // Assert
      const consoleErrorSpy = jest.spyOn(console, "error");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("roleController, getRoles:")
      );
    });
  });

  describe("getRoleHandler", () => {
    it("should return role when found", async () => {
      // Arrange
      const req = {
        roleId: mockRolesData[0]._id.toString(),
      };

      // Act
      await controller.getRoleHandler(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        resultMessage: "ENTITY_FOUND",
        role: mockRolesData[0],
      });
      expect(mockRoleService.listRoleByID).toHaveBeenCalledWith(req);
    });

    it("should return 404 when role not found", async () => {
      // Arrange
      const req = {
        roleId: "non-existent-id",
      };

      // Act
      await controller.getRoleHandler(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: 404,
        resultMessage: "ENTITY_NOT_FOUND",
      });
      expect(mockRoleService.listRoleByID).toHaveBeenCalledWith(req);
    });

    it("should handle service errors", async () => {
      // Arrange
      const req = {
        roleId: mockRolesData[0]._id.toString(),
      };
      mockRoleService.listRoleByID.mockRejectedValueOnce(
        new Error("Database error")
      );

      // Act
      await controller.getRoleHandler(req, res);

      // Assert
      const consoleErrorSpy = jest.spyOn(console, "error");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("roleController, getRole:")
      );
    });
  });

  describe("newRoleHandler", () => {
    it("should create role successfully", async () => {
      // Arrange
      const newRole = {
        name: "New Role",
        description: "A new role description",
        status: true,
        permissions: {
          user: 1,
          role: 2,
        },
      };
      const req = {
        role: newRole,
      };

      // Act
      await controller.newRoleHandler(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: 201,
        resultMessage: "ROLE_CREATED",
        role: newRole,
      });
      expect(mockRoleService.createRole).toHaveBeenCalledWith(req);
    });

    it("should return 400 when role already exists", async () => {
      // Arrange
      const req = {
        role: {
          name: mockRolesData[0].name,
          description: "Some description",
          status: true,
          permissions: {
            user: 1,
            role: 2,
          },
        },
      };

      // Act
      await controller.newRoleHandler(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        resultMessage: "ROLE_ALREADY_EXISTS",
      });
      expect(mockRoleService.createRole).toHaveBeenCalledWith(req);
    });

    it("should handle service errors", async () => {
      // Arrange
      const req = {
        role: {
          name: "New Role",
          description: "Some description",
          status: true,
          permissions: {
            user: 1,
            role: 2,
          },
        },
      };
      mockRoleService.createRole.mockRejectedValueOnce(
        new Error("Database error")
      );

      // Act
      await controller.newRoleHandler(req, res);

      // Assert
      const consoleErrorSpy = jest.spyOn(console, "error");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("roleController, newRole:")
      );
    });
  });

  describe("updateRoleHandler", () => {
    it("should update role successfully", async () => {
      // Arrange
      const updatedRole = {
        _id: mockRolesData[0]._id.toString(),
        name: "Updated Role",
        description: "Updated description",
        status: true,
        permissions: {
          user: 1,
          role: 2,
        },
      };
      const req = {
        role: updatedRole,
      };

      // Act
      await controller.updateRoleHandler(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        resultMessage: "ROLE_UPDATED",
        role: updatedRole,
      });
      expect(mockRoleService.updateRoleByID).toHaveBeenCalledWith(req);
    });

    it("should return 404 when role not found", async () => {
      // Arrange
      const req = {
        role: {
          _id: "non-existent-id",
          name: "Some Role",
          description: "Some description",
          status: true,
          permissions: {
            user: 1,
            role: 2,
          },
        },
      };

      // Act
      await controller.updateRoleHandler(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        httpStatusCode: 404,
        resultMessage: "ENTITY_NOT_FOUND",
      });
      expect(mockRoleService.updateRoleByID).toHaveBeenCalledWith(req);
    });

    it("should handle service errors", async () => {
      // Arrange
      const req = {
        role: {
          _id: mockRolesData[0]._id.toString(),
          name: "Updated Role",
          description: "Updated description",
          status: true,
          permissions: {
            user: 1,
            role: 2,
          },
        },
      };

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      mockRoleService.updateRoleByID.mockRejectedValueOnce(
        new Error("Database error")
      );

      // Act
      await controller.updateRoleHandler(req, res);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("roleController, updateRole:")
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe("deleteRoleHandler", () => {
    it("should delete role successfully", async () => {
      // Arrange
      const req = {
        roleId: mockRolesData[0]._id.toString(),
      };

      // Act
      await controller.deleteRoleHandler(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: 200,
        resultMessage: "ENTITY_DELETED",
      });
      expect(mockRoleService.deleteRoleByID).toHaveBeenCalledWith(req);
    });

    it("should return 404 when role not found", async () => {
      // Arrange
      const req = {
        roleId: "non-existent-id",
      };

      // Act
      await controller.deleteRoleHandler(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: 404,
        resultMessage: "ENTITY_NOT_FOUND",
      });
      expect(mockRoleService.deleteRoleByID).toHaveBeenCalledWith(req);
    });

    it("should handle service errors", async () => {
      // Arrange
      const req = {
        roleId: mockRolesData[0]._id.toString(),
      };
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      mockRoleService.deleteRoleByID.mockRejectedValueOnce(
        new Error("Database error")
      );

      // Act
      await controller.deleteRoleHandler(req, res);

      // Assert

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("roleController, deleteRole:")
      );
      consoleErrorSpy.mockRestore();
    });
  });
});
