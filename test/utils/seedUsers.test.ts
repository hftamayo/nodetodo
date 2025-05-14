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
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

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
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("User created: ") ?? expect.anything()
    );
    consoleSpy.mockRestore();
  });

  it("should handle errors and log them", async () => {
    (User.deleteMany as jest.Mock).mockImplementation(() => {
      throw new Error("delete error");
    });
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    await seedUsers(mockSession);
    expect(consoleSpy).toHaveBeenCalledWith("seedUsers: ", "delete error");
    consoleSpy.mockRestore();
  });

  it("should throw if roles are not found", async () => {
    (seedRoles as jest.Mock).mockResolvedValue(undefined);
    await expect(seedUsers(mockSession)).rejects.toThrow(
      "Roles not found in the database"
    );
  });

  it("should throw if required roles are missing", async () => {
    (seedRoles as jest.Mock).mockResolvedValue([
      { _id: "1", name: "administrator" },
    ]);
    await expect(seedUsers(mockSession)).rejects.toThrow(
      "Roles not found in the database"
    );
  });
});
