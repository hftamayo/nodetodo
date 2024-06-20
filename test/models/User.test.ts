import User from "../../src/models/User";
import { mockUserRoleUser } from "../mocks/user.mock";

describe("User Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user with valid data", async () => {
    const saveMock = jest
      .spyOn(User.prototype, "save")
      .mockResolvedValue(mockUserRoleUser);

    const user = new User(mockUserRoleUser);

    await user.save();

    expect(user).toBeDefined();
    expect(user.name).toEqual(mockUserRoleUser.name);
    expect(user.email).toEqual(mockUserRoleUser.email);
    expect(user.password).toEqual(mockUserRoleUser.password);
    expect(user.age).toEqual(mockUserRoleUser.age);

    saveMock.mockRestore();
  });

  it("should throw an error if the user's name is missing", async () => {
    const { name, ...userWithoutName } = mockUserRoleUser;
    const saveMock = jest
      .spyOn(User.prototype, "save")
      .mockRejectedValue(
        new Error("User validation failed: `name` is required")
      );

    const user = new User(userWithoutName);

    await expect(user.save()).rejects.toThrow(
      "User validation failed: `name` is required"
    );

    saveMock.mockRestore();
  });

  it("should throw an error if the user's email is missing", async () => {
    const { email, ...userWithoutEmail } = mockUserRoleUser;
    const saveMock = jest
      .spyOn(User.prototype, "save")
      .mockRejectedValue(
        new Error("User validation failed: `email` is required")
      );

    const user = new User(userWithoutEmail);

    await expect(user.save()).rejects.toThrow(
      "User validation failed: `email` is required"
    );

    saveMock.mockRestore();
  });

  it("should throw an error if the user's password is missing", async () => {
    const { password, ...userWithoutPassword } = mockUserRoleUser;
    const saveMock = jest
      .spyOn(User.prototype, "save")
      .mockRejectedValue(
        new Error("User validation failed: `password` is required")
      );

    const user = new User(userWithoutPassword);

    await expect(user.save()).rejects.toThrow(
      "User validation failed: `password` is required"
    );
    saveMock.mockRestore();
  });

  it("should throw an error if the user's age is missing", async () => {
    const { age, ...userWithoutAge } = mockUserRoleUser;
    const saveMock = jest
      .spyOn(User.prototype, "save")
      .mockRejectedValue(
        new Error("User validation failed: `age` is required")
      );

    const user = new User(userWithoutAge);

    await expect(user.save()).rejects.toThrow(
      "User validation failed: `age` is required"
    );
    saveMock.mockRestore();
  });
});
