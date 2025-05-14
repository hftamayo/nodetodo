import seedRoles from "@/utils/seedRoles";
import Role from "@models/Role";
import mongoose from "mongoose";

jest.mock("@models/Role");

const mockSession = {} as mongoose.ClientSession;

describe("seedRoles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete all roles and create new ones", async () => {
    (Role.deleteMany as jest.Mock).mockReturnValue({
      session: jest.fn().mockResolvedValue(undefined),
    });
    (Role.create as jest.Mock).mockImplementation(async (roleArr, opts) => [
      { ...roleArr[0], _id: "mockedid" },
    ]);
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    const createdRoles = await seedRoles(mockSession);

    expect(Role.deleteMany).toHaveBeenCalledWith({});
    expect(Role.create).toHaveBeenCalled();
    expect(Array.isArray(createdRoles)).toBe(true);
    if (createdRoles) {
      expect(createdRoles.length).toBeGreaterThan(0);
    }
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Role created: ") ?? expect.anything()
    );
    consoleSpy.mockRestore();
  });

  it("should handle errors and log them", async () => {
    (Role.deleteMany as jest.Mock).mockImplementation(() => {
      throw new Error("delete error");
    });
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    await seedRoles(mockSession);
    expect(consoleSpy).toHaveBeenCalledWith("seedRoles: ", "delete error");
    consoleSpy.mockRestore();
  });
});
