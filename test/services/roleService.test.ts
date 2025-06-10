import roleService from "@/services/roleService";
import Role from "@/models/Role";
import { RoleIdRequest, UpdateRoleRequest } from "@/types/role.types";
import { mockRolesData, expectedFilteredRoles } from "../mocks/role.mock";

jest.mock("@/models/Role");

// Helper functions for test setup
const createMockMongooseChain = (mockExec: jest.Mock) => {
  const mockLimit = jest.fn().mockReturnValue({ exec: mockExec });
  const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
  const mockSort = jest.fn().mockReturnValue({ skip: mockSkip });
  return { sort: mockSort };
};

const createTestRole = (overrides = {}) => ({
  name: "Test Role",
  description: "Test Description",
  status: true,
  permissions: { user: 1, role: 2 },
  ...overrides,
});

const createTestRoleRequest = (overrides = {}) => ({
  role: createTestRole(overrides),
});

// Test data constants
const TEST_PAGINATION = {
  page: 1,
  limit: 10,
};

const TEST_ROLE_ID = mockRolesData[0]._id.toString();

describe("Role Service - listRoles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully return roles when found", async () => {
    // Arrange
    const mockExec = jest.fn().mockResolvedValue(mockRolesData);
    (Role.find as jest.Mock).mockReturnValue(createMockMongooseChain(mockExec));

    // Act
    const result = await roleService.listRoles(TEST_PAGINATION);

    // Assert
    expect(result.httpStatusCode).toBe(200);
    expect(result.message).toBe("ROLES_FOUND");
    expect(result.roles).toEqual(expectedFilteredRoles);

    // Verify mongoose chain calls
    expect(Role.find).toHaveBeenCalled();
    expect(mockExec).toHaveBeenCalled();
  });

  it("should return 404 when no roles are found", async () => {
    // Arrange
    const mockExec = jest.fn().mockResolvedValue([]);
    (Role.find as jest.Mock).mockReturnValue(createMockMongooseChain(mockExec));

    // Act
    const result = await roleService.listRoles(TEST_PAGINATION);

    // Assert
    expect(result.httpStatusCode).toBe(404);
    expect(result.message).toBe("ROLES_NOT_FOUND");
    expect(result.roles).toBeUndefined();
  });

  it("should return 500 when database error occurs", async () => {
    // Arrange
    const mockExec = jest.fn().mockRejectedValue(new Error("Database error"));
    (Role.find as jest.Mock).mockReturnValue(createMockMongooseChain(mockExec));

    // Act
    const result = await roleService.listRoles(TEST_PAGINATION);

    // Assert
    expect(result.httpStatusCode).toBe(500);
    expect(result.message).toBe("UNKNOWN_ERROR");
    expect(result.roles).toBeUndefined();
  });
});

describe("Role Service - listRoleByID", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully return a role when found", async () => {
    // Arrange
    const mockExec = jest.fn().mockResolvedValue(mockRolesData[0]);
    (Role.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const params: RoleIdRequest = {
      roleId: TEST_ROLE_ID,
    };

    // Act
    const result = await roleService.listRoleByID(params);

    // Assert
    expect(result.httpStatusCode).toBe(200);
    expect(result.message).toBe("ENTITY_FOUND");
    expect(result.role).toEqual(expectedFilteredRoles[0]);
    expect(Role.findById).toHaveBeenCalledWith(params.roleId);
  });

  it("should return 404 when role is not found", async () => {
    // Arrange
    const mockExec = jest.fn().mockResolvedValue(null);
    (Role.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const params: RoleIdRequest = {
      roleId: "non-existent-id",
    };

    // Act
    const result = await roleService.listRoleByID(params);

    // Assert
    expect(result.httpStatusCode).toBe(404);
    expect(result.message).toBe("ENTITY_NOT_FOUND");
    expect(result.role).toBeUndefined();
  });

  it("should return 500 when database error occurs", async () => {
    // Arrange
    const mockExec = jest.fn().mockRejectedValue(new Error("Database error"));
    (Role.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const params: RoleIdRequest = {
      roleId: TEST_ROLE_ID,
    };

    // Act
    const result = await roleService.listRoleByID(params);

    // Assert
    expect(result.httpStatusCode).toBe(500);
    expect(result.message).toBe("UNKNOWN_ERROR");
    expect(result.role).toBeUndefined();
  });
});

describe("Role Service - createRole", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully create a new role", async () => {
    // Arrange
    const mockRole = {
      ...mockRolesData[0],
      save: jest.fn().mockResolvedValue(mockRolesData[0]),
    };

    const mockFindOneExec = jest.fn().mockResolvedValue(null);
    (Role.findOne as jest.Mock).mockReturnValue({ exec: mockFindOneExec });

    (Role as unknown as jest.Mock).mockImplementation(() => mockRole);

    const params = createTestRoleRequest({
      name: mockRole.name,
      description: mockRole.description,
      status: mockRole.status,
      permissions: {
        users: mockRole.permissions.get("users"),
        roles: mockRole.permissions.get("roles"),
      },
    });

    // Act
    const result = await roleService.createRole(params);

    // Assert
    expect(result.httpStatusCode).toBe(201);
    expect(result.message).toBe("ROLE_CREATED");
    expect(result.role).toBeDefined();
    expect(result.role?.name).toBe(params.role.name);
    expect(Role.findOne).toHaveBeenCalledWith({ name: params.role.name });
    expect(mockFindOneExec).toHaveBeenCalled();
    expect(mockRole.save).toHaveBeenCalled();
  });

  it("should return 400 when role already exists", async () => {
    // Arrange
    const mockFindOneExec = jest.fn().mockResolvedValue(mockRolesData[0]);
    (Role.findOne as jest.Mock).mockReturnValue({ exec: mockFindOneExec });

    const params = createTestRoleRequest({
      name: mockRolesData[0].name,
      description: mockRolesData[0].description,
      status: mockRolesData[0].status,
      permissions: Object.fromEntries(mockRolesData[0].permissions),
    });

    // Act
    const result = await roleService.createRole(params);

    // Assert
    expect(result.httpStatusCode).toBe(400);
    expect(result.message).toBe("ROLE_ALREADY_EXISTS");
    expect(result.role).toBeUndefined();
  });

  it("should return 400 when missing required fields", async () => {
    // Arrange
    const params = createTestRoleRequest({
      name: "",
      description: "",
      permissions: {},
    });

    // Act
    const result = await roleService.createRole(params);

    // Assert
    expect(result.httpStatusCode).toBe(400);
    expect(result.message).toBe("MISSING_FIELDS");
    expect(result.role).toBeUndefined();
  });

  it("should return 500 when database error occurs", async () => {
    // Arrange
    const mockFindOneExec = jest.fn().mockResolvedValue(null);
    (Role.findOne as jest.Mock).mockReturnValue({ exec: mockFindOneExec });

    (Role as unknown as jest.Mock).mockImplementation(() => {
      throw new Error("Database error");
    });

    const params = createTestRoleRequest({
      name: mockRolesData[1].name,
      description: mockRolesData[1].description,
      status: mockRolesData[1].status,
      permissions: Object.fromEntries(mockRolesData[0].permissions),
    });

    // Act
    const result = await roleService.createRole(params);

    // Assert
    expect(result.httpStatusCode).toBe(500);
    expect(result.message).toBe("UNKNOWN_ERROR");
    expect(result.role).toBeUndefined();
  });
});

describe("Role Service - updateRoleByID", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully update a role", async () => {
    // Arrange
    const existingRole = mockRolesData[0];
    const mockExec = jest.fn().mockResolvedValue({
      ...existingRole,
      save: jest.fn().mockResolvedValue(existingRole),
    });
    (Role.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const params: UpdateRoleRequest = {
      role: {
        _id: existingRole._id.toString(),
        name: "Updated Role",
        description: "Updated description",
        status: false,
        permissions: {
          users: 5,
          roles: 3,
        },
      },
    };

    // Act
    const result = await roleService.updateRoleByID(params);

    // Assert
    expect(result.httpStatusCode).toBe(200);
    expect(result.message).toBe("ROLE_UPDATED");
    expect(result.role).toBeDefined();
    expect(result.role?.name).toBe(params.role.name);
    expect(Role.findById).toHaveBeenCalledWith(params.role._id);
    expect(mockExec).toHaveBeenCalled();
  });

  it("should return 404 when role is not found", async () => {
    // Arrange
    const mockExec = jest.fn().mockResolvedValue(null);
    (Role.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const params: UpdateRoleRequest = {
      role: {
        _id: "non-existent-id",
        name: "Updated Role",
      },
    };

    // Act
    const result = await roleService.updateRoleByID(params);

    // Assert
    expect(result.httpStatusCode).toBe(404);
    expect(result.message).toBe("ENTITY_NOT_FOUND");
    expect(result.role).toBeUndefined();
  });

  it("should return 400 when missing required fields", async () => {
    // Arrange
    const params: UpdateRoleRequest = {
      role: {
        _id: mockRolesData[0]._id.toString(),
      },
    };

    // Act
    const result = await roleService.updateRoleByID(params);

    // Assert
    expect(result.httpStatusCode).toBe(400);
    expect(result.message).toBe("MISSING_FIELDS");
    expect(result.role).toBeUndefined();
  });

  it("should return 400 when _id is missing", async () => {
    // Arrange
    const params: UpdateRoleRequest = {
      role: {
        name: "Updated Role",
        description: "Updated description",
      },
    } as UpdateRoleRequest;

    // Act
    const result = await roleService.updateRoleByID(params);

    // Assert
    expect(result.httpStatusCode).toBe(400);
    expect(result.message).toBe("MISSING_FIELDS");
    expect(result.role).toBeUndefined();
  });

  it("should return 500 when database error occurs", async () => {
    // Arrange
    const mockExec = jest.fn().mockRejectedValue(new Error("Database error"));
    (Role.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const params: UpdateRoleRequest = {
      role: {
        _id: mockRolesData[0]._id.toString(),
        name: "Updated Role",
      },
    };

    // Act
    const result = await roleService.updateRoleByID(params);

    // Assert
    expect(result.httpStatusCode).toBe(500);
    expect(result.message).toBe("UNKNOWN_ERROR");
    expect(result.role).toBeUndefined();
  });

  it("should update only provided fields", async () => {
    // Arrange
    const existingRole = mockRolesData[0];
    const mockExec = jest.fn().mockResolvedValue({
      ...existingRole,
      save: jest.fn().mockResolvedValue(existingRole),
    });
    (Role.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const params: UpdateRoleRequest = {
      role: {
        _id: existingRole._id.toString(),
        name: "Updated Role",
        // description and status not included
      },
    };

    // Act
    const result = await roleService.updateRoleByID(params);

    // Assert
    expect(result.httpStatusCode).toBe(200);
    expect(result.message).toBe("ROLE_UPDATED");
    expect(result.role?.name).toBe("Updated Role");
    expect(result.role?.description).toBe(existingRole.description);
    expect(result.role?.status).toBe(existingRole.status);
  });
});

describe("Role Service - deleteRoleByID", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully delete a role", async () => {
    // Arrange
    const existingRole = {
      ...mockRolesData[0],
      deleteOne: jest.fn().mockResolvedValue(undefined),
    };
    const mockExec = jest.fn().mockResolvedValue(existingRole);
    (Role.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const params: RoleIdRequest = {
      roleId: existingRole._id.toString(),
    };

    // Act
    const result = await roleService.deleteRoleByID(params);

    // Assert
    expect(result.httpStatusCode).toBe(200);
    expect(result.message).toBe("ENTITY_DELETED");
    expect(Role.findById).toHaveBeenCalledWith(params.roleId);
    expect(existingRole.deleteOne).toHaveBeenCalled();
  });

  it("should return 404 when role is not found", async () => {
    // Arrange
    const mockExec = jest.fn().mockResolvedValue(null);
    (Role.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const params: RoleIdRequest = {
      roleId: "non-existent-id",
    };

    // Act
    const result = await roleService.deleteRoleByID(params);

    // Assert
    expect(result.httpStatusCode).toBe(404);
    expect(result.message).toBe("ENTITY_NOT_FOUND");
    expect(Role.findById).toHaveBeenCalledWith(params.roleId);
  });

  it("should return 500 when database error occurs", async () => {
    // Arrange
    const mockExec = jest.fn().mockRejectedValue(new Error("Database error"));
    (Role.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const params: RoleIdRequest = {
      roleId: mockRolesData[0]._id.toString(),
    };

    // Act
    const result = await roleService.deleteRoleByID(params);

    // Assert
    expect(result.httpStatusCode).toBe(500);
    expect(result.message).toBe("UNKNOWN_ERROR");
  });
});
