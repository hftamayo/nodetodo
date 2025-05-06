import roleService from "@/services/roleService";
import Role from "@/models/Role";
import {
  ListRolesRequest,
  RoleIdRequest,
  NewRoleRequest,
} from "@/types/role.types";
import { createRoleMock } from "@test/mocks/factories/createRoleMock";
import { mockRolesData, expectedFilteredRoles } from "../mocks/role.mock";

jest.mock("@/models/Role");

describe("Role Service - listRoles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully return roles when found", async () => {
    // Arrange
    const mockExec = jest.fn().mockResolvedValue(mockRolesData);
    const mockLimit = jest.fn().mockReturnValue({ exec: mockExec });
    const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
    const mockSort = jest.fn().mockReturnValue({ skip: mockSkip });
    (Role.find as jest.Mock).mockReturnValue({ sort: mockSort });

    const params: ListRolesRequest = {
      page: 1,
      limit: 10,
    };

    // Act
    const result = await roleService.listRoles(params);

    // Assert
    expect(result.httpStatusCode).toBe(200);
    expect(result.message).toBe("ROLES_FOUND");
    expect(result.roles).toEqual(expectedFilteredRoles);

    // Verify mongoose chain calls
    expect(Role.find).toHaveBeenCalled();
    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(mockSkip).toHaveBeenCalledWith(0);
    expect(mockLimit).toHaveBeenCalledWith(10);
  });

  it("should return 404 when no roles are found", async () => {
    // Arrange
    const mockExec = jest.fn().mockResolvedValue([]);
    const mockLimit = jest.fn().mockReturnValue({ exec: mockExec });
    const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
    const mockSort = jest.fn().mockReturnValue({ skip: mockSkip });
    (Role.find as jest.Mock).mockReturnValue({ sort: mockSort });

    const params: ListRolesRequest = {
      page: 1,
      limit: 10,
    };

    // Act
    const result = await roleService.listRoles(params);

    // Assert
    expect(result.httpStatusCode).toBe(404);
    expect(result.message).toBe("ROLES_NOT_FOUND");
    expect(result.roles).toBeUndefined();
  });

  it("should return 500 when database error occurs", async () => {
    // Arrange
    const mockExec = jest.fn().mockRejectedValue(new Error("Database error"));
    const mockLimit = jest.fn().mockReturnValue({ exec: mockExec });
    const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
    const mockSort = jest.fn().mockReturnValue({ skip: mockSkip });
    (Role.find as jest.Mock).mockReturnValue({ sort: mockSort });

    const params: ListRolesRequest = {
      page: 1,
      limit: 10,
    };

    // Act
    const result = await roleService.listRoles(params);

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
      roleId: mockRolesData[0]._id.toString(),
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
      roleId: mockRolesData[0]._id.toString(),
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
    const mockFindOneExec = jest.fn().mockResolvedValue(null);
    (Role.findOne as jest.Mock).mockReturnValue({ exec: mockFindOneExec });

    const mockRole = createRoleMock(mockRolesData[0]);
    const mockSave = jest
      .spyOn(Role.prototype, "save")
      .mockResolvedValue(mockRole);
    jest.spyOn(Role.prototype, "save").mockResolvedValue(mockRole);
    jest.spyOn(Role, "create").mockResolvedValue(mockRole);

    const params: NewRoleRequest = {
      role: {
        name: mockRolesData[0].name,
        description: mockRolesData[0].description,
        status: mockRolesData[0].status,
        permissions: Object.fromEntries(mockRolesData[0].permissions),
      },
    };

    // Act
    const result = await roleService.createRole(params);

    // Assert
    expect(result.httpStatusCode).toBe(201);
    expect(result.message).toBe("ROLE_CREATED");
    expect(result.role).toBeDefined();
    expect(result.role?.name).toBe(params.role.name);
    expect(Role.findOne).toHaveBeenCalledWith({ name: params.role.name });
    expect(mockSave).toHaveBeenCalled();
  });

  it("should return 400 when role already exists", async () => {
    // Arrange
    const mockFindOneExec = jest.fn().mockResolvedValue(mockRolesData[0]);
    (Role.findOne as jest.Mock).mockReturnValue({ exec: mockFindOneExec });

    const params: NewRoleRequest = {
      role: {
        name: mockRolesData[0].name,
        description: mockRolesData[0].description,
        status: mockRolesData[0].status,
        permissions: Object.fromEntries(mockRolesData[0].permissions),
      },
    };

    // Act
    const result = await roleService.createRole(params);

    // Assert
    expect(result.httpStatusCode).toBe(400);
    expect(result.message).toBe("ROLE_ALREADY_EXISTS");
    expect(result.role).toBeUndefined();
  });

  it("should return 400 when missing required fields", async () => {
    // Arrange
    const params: NewRoleRequest = {
      role: {
        name: "",
        description: "",
        status: true,
        permissions: Object.fromEntries(new Map()),
      },
    };

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

    const mockRole = createRoleMock(mockRolesData[0]);
    jest.spyOn(Role.prototype, "save").mockResolvedValue(mockRole);
    jest.spyOn(Role, "create").mockResolvedValue(mockRole);

    const params: NewRoleRequest = {
      role: {
        name: mockRolesData[1].name,
        description: mockRolesData[1].description,
        status: mockRolesData[1].status,
        permissions: Object.fromEntries(mockRolesData[0].permissions),
      },
    };

    // Act
    const result = await roleService.createRole(params);

    // Assert
    expect(result.httpStatusCode).toBe(500);
    expect(result.message).toBe("UNKNOWN_ERROR");
    expect(result.role).toBeUndefined();
  });
});
