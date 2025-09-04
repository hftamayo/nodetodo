import roleService from "@/services/roleService";
import Role from "@/models/Role";
import { RoleIdRequest, UpdateRoleRequest } from "@/types/role.types";
import { mockRolesData } from "../mocks/role.mock";
import { paginate } from "@/services/paginationService";
import { 
  singlePagePagination, 
  emptyResultPagination,
  mockPaginatedResponse,
  mockEmptyPaginatedResponse
} from "../mocks/pagination.mock";
import { 
  mockInternalServerErrorResponse 
} from "../mocks/dto.mock";

jest.mock("@/models/Role");
jest.mock("@/services/paginationService");

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
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should successfully return roles when found", async () => {
    // Arrange
    const mockRoles = mockRolesData.map((role: any) => ({
      ...role,
      permissions:
        role.name === "admin" ? { users: 7, roles: 7 } : { users: 1, roles: 1 },
    }));

    const mockPaginatedResponseData = {
      ...mockPaginatedResponse,
      data: mockRoles,
    };

    (paginate as jest.Mock).mockResolvedValue(mockPaginatedResponseData);

    // Act
    const result = await roleService.listRoles(TEST_PAGINATION);

    // Assert - listRoles returns PaginatedResponseDTO format
    expect("data" in result).toBe(true);
    expect("pagination" in result).toBe(true);
    
    const paginatedResult = result as any; // Type assertion after type guard
    expect(Array.isArray(paginatedResult.data)).toBe(true);
    expect(paginatedResult.data!.length).toBe(mockRoles.length);
    expect(paginatedResult.pagination).toBeDefined();
    expect(paginatedResult.etag).toBeDefined();
    expect(paginatedResult.lastModified).toBeDefined();

    // Check individual roles and their permissions
    paginatedResult.data?.forEach((role: any, index: number) => {
      const expectedRole = mockRoles[index];
      expect(role._id).toBe(expectedRole._id);
      expect(role.name).toBe(expectedRole.name);
      expect(role.description).toBe(expectedRole.description);
      expect(role.status).toBe(expectedRole.status);
      expect(role.permissions).toEqual(expectedRole.permissions);
    });

    // Verify paginate service was called
    expect(paginate).toHaveBeenCalledWith(Role, {
      page: 1,
      limit: 10,
      cursor: undefined,
      sort: "createdAt",
      order: "desc",
      filters: {},
    });
  });

  it("should return 404 when no roles are found", async () => {
    // Arrange
    (paginate as jest.Mock).mockResolvedValue(mockEmptyPaginatedResponse);

    // Act
    const result = await roleService.listRoles(TEST_PAGINATION);

    // Assert - listRoles returns PaginatedResponseDTO format
    expect("data" in result).toBe(true);
    expect("pagination" in result).toBe(true);
    
    const paginatedResult = result as any; // Type assertion after type guard
    expect(Array.isArray(paginatedResult.data)).toBe(true);
    expect(paginatedResult.data!.length).toBe(0);
    expect(paginatedResult.pagination).toBeDefined();
    expect(paginatedResult.etag).toBeDefined();
  });

  it("should return 500 when database error occurs", async () => {
    // Arrange
    (paginate as jest.Mock).mockResolvedValue(mockInternalServerErrorResponse);

    // Act
    const result = await roleService.listRoles(TEST_PAGINATION);

    // Assert - listRoles returns ErrorResponseDTO format on error
    expect("code" in result).toBe(true);
    expect("resultMessage" in result).toBe(true);
    
    const errorResult = result as any; // Type assertion after type guard
    expect(errorResult.code).toBe(500);
    expect(errorResult.resultMessage).toBe("UNKNOWN_SERVER_ERROR");
    expect("data" in result).toBe(false);
  });
});

describe("Role Service - listRoleByID", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully return a role when found", async () => {
    // Arrange
    const originalFromEntries = Object.fromEntries;

    // Override fromEntries to handle our mock object
    Object.fromEntries = jest.fn().mockImplementation((iterable) => {
      // If this is our mock permissions object (not a real Map)
      if (
        iterable &&
        typeof iterable.entries === "function" &&
        !(iterable instanceof Map)
      ) {
        return {
          users: 7,
          roles: 7,
        };
      }
      // Otherwise use the original implementation
      return originalFromEntries(iterable);
    });

    const mockRole = {
      ...mockRolesData[0],
      permissions: {
        get: (key: string): number | undefined => {
          if (key === "users") return 7;
          if (key === "roles") return 7;
          return undefined;
        },
        entries: function* (): IterableIterator<[string, number]> {
          yield ["users", 7];
          yield ["roles", 7];
        },
        forEach: jest.fn(),
      },
    };

    const mockExec = jest.fn().mockResolvedValue(mockRole);
    (Role.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const params: RoleIdRequest = {
      roleId: TEST_ROLE_ID,
    };

    // Act
    const result = await roleService.listRoleByID(params);
    // Assert
    expect(result.httpStatusCode).toBe(200);
    expect(result.message).toBe("Role retrieved successfully");
    expect(result.data?._id).toBe(mockRole._id);
    expect(result.data?.name).toBe(mockRole.name);
    expect(result.data?.permissions).toEqual({
      users: 7,
      roles: 7,
    });
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
    expect(result.message).toBe("Role not found");
    expect(result.data).toBeUndefined();
  });

  it("should throw error when database error occurs", async () => {
    // Arrange
    const mockExec = jest.fn().mockRejectedValue(new Error("Database error"));
    (Role.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const params: RoleIdRequest = {
      roleId: TEST_ROLE_ID,
    };

    // Act & Assert
    await expect(roleService.listRoleByID(params)).rejects.toThrow("Database error");
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
    expect(result.message).toBe("Role created successfully");
    expect(result.data).toBeDefined();
    expect(result.data?.name).toBe(params.role.name);
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
    expect(result.httpStatusCode).toBe(409);
    expect(result.message).toBe("Role with this name already exists");
    expect(result.data).toBeUndefined();
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
    expect(result.message).toBe("Missing required fields");
    expect(result.data).toBeUndefined();
  });

  it("should throw error when database error occurs", async () => {
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

    // Act & Assert
    await expect(roleService.createRole(params)).rejects.toThrow("Database error");
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
    expect(result.message).toBe("Role updated successfully");
    expect(result.data).toBeDefined();
    expect(result.data?.name).toBe(params.role.name);
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
    expect(result.message).toBe("Role not found");
    expect(result.data).toBeUndefined();
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
    expect(result.message).toBe("Missing required fields");
    expect(result.data).toBeUndefined();
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
    expect(result.message).toBe("Missing required fields");
    expect(result.data).toBeUndefined();
  });

  it("should throw error when database error occurs", async () => {
    // Arrange
    const mockExec = jest.fn().mockRejectedValue(new Error("Database error"));
    (Role.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const params: UpdateRoleRequest = {
      role: {
        _id: mockRolesData[0]._id.toString(),
        name: "Updated Role",
      },
    };

    // Act & Assert
    await expect(roleService.updateRoleByID(params)).rejects.toThrow("Database error");
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
    expect(result.message).toBe("Role updated successfully");
    expect(result.data?.name).toBe("Updated Role");
    expect(result.data?.description).toBe(existingRole.description);
    expect(result.data?.status).toBe(existingRole.status);
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
    expect(result.message).toBe("Role deleted successfully");
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
    expect(result.message).toBe("Role not found");
    expect(Role.findById).toHaveBeenCalledWith(params.roleId);
  });

  it("should throw error when database error occurs", async () => {
    // Arrange
    const mockExec = jest.fn().mockRejectedValue(new Error("Database error"));
    (Role.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const params: RoleIdRequest = {
      roleId: mockRolesData[0]._id.toString(),
    };

    // Act & Assert
    await expect(roleService.deleteRoleByID(params)).rejects.toThrow("Database error");
  });
});
