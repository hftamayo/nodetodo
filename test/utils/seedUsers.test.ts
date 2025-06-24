import seedUsers from "@/utils/seedUsers";
import User from "@models/User";
import bcrypt from "bcrypt";
import seedRoles from "@/utils/seedRoles";
import mongoose from "mongoose";

jest.mock("@models/User");
jest.mock("bcrypt");
jest.mock("@/utils/seedRoles");

const mockSession = {} as mongoose.ClientSession;

const mockRoles = [
  { _id: "1", name: "administrator" },
  { _id: "2", name: "supervisor" },
  { _id: "3", name: "finaluser" },
];

describe("seedUsers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (seedRoles as jest.Mock).mockResolvedValue(mockRoles);
    (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
    (bcrypt.hash as jest.Mock).mockImplementation(async (pw) => `hashed_${pw}`);
  });

  it("should delete all users and create new ones with hashed passwords", async () => {
    (User.deleteMany as jest.Mock).mockReturnValue({
      session: jest.fn().mockResolvedValue(undefined),
    });
    (User.create as jest.Mock).mockImplementation(async (userArr, opts) => [
      { ...userArr[0], _id: "mockedid" },
    ]);
    const consoleSpy = jest.spyOn(console, "log");

    const createdUsers = await seedUsers(mockSession);

    expect(seedRoles).toHaveBeenCalledWith(mockSession);
    expect(User.deleteMany).toHaveBeenCalledWith({});
    expect(User.create).toHaveBeenCalled();
    expect(bcrypt.genSalt).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(Array.isArray(createdUsers)).toBe(true);
    if (createdUsers) {
      expect(createdUsers.length).toBeGreaterThan(0);
    }
    // Check that console.log was called with the expected arguments
    expect(consoleSpy).toHaveBeenCalledWith(
      "User created: ",
      expect.objectContaining({
        _id: "mockedid",
        name: expect.any(String),
        email: expect.any(String),
        age: expect.any(Number),
        role: expect.any(String),
        status: expect.any(Boolean)
      })
    );
    consoleSpy.mockRestore();
  });

  it("should handle errors and log them", async () => {
    (User.deleteMany as jest.Mock).mockImplementation(() => {
      throw new Error("delete error");
    });
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const result = await seedUsers(mockSession);
    expect(consoleSpy).toHaveBeenCalledWith("seedUsers: ", "delete error");
    expect(result).toBeUndefined();
    consoleSpy.mockRestore();
  });

  it("should return undefined if roles are not found", async () => {
    (seedRoles as jest.Mock).mockResolvedValue(undefined);
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const result = await seedUsers(mockSession);
    expect(consoleSpy).toHaveBeenCalledWith("seedUsers: ", "Roles not found in the database");
    expect(result).toBeUndefined();
    consoleSpy.mockRestore();
  });

  it("should return undefined if required roles are missing", async () => {
    (seedRoles as jest.Mock).mockResolvedValue([
      { _id: "1", name: "administrator" },
    ]);
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const result = await seedUsers(mockSession);
    expect(consoleSpy).toHaveBeenCalledWith("seedUsers: ", "Roles not found in the database");
    expect(result).toBeUndefined();
    consoleSpy.mockRestore();
  });
});
