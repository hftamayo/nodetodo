const User = require("../../src/models/User");

describe("User Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user with valid data", async () => {
    const saveMock = jest.spyOn(User.prototype, "save").mockResolvedValue({
      name: mockUserUser.name,
      email: mockUserUser.email,
      password: mockUserUser.password,
      age: mockUserUser.age,
    });

    const user = new User({
      name: mockUserUser.name,
      email: mockUserUser.email,
      password: mockUserUser.password,
      age: mockUserUser.age,
    });

    await user.save();

    expect(user).to.exist;
    expect(user.name).toEqual(mockUserUser.name);
    expect(user.email).toEqual(mockUserUser.email);
    expect(user.age).toEqual(mockUserUser.age);

    saveMock.mockRestore();
  });

  it("should throw an error if the user's name is missing", async () => {
    const saveMock = jest.spyOn(User.prototype, "save").mockRejectedValue(new Error("User validation failed: `name` is required"));

    const user = new User({
      name: "",
      email: mockUserUser.email,
      password: mockUserUser.password,
      age: mockUserUser.age,
    });

    await expect(user.save()).rejects.toThrow("User validation failed: `name` is required");

    saveMock.mockRestore();
  });

  it("should throw an error if the user's email is missing", async () => {
    const saveMock = jest.spyOn(User.prototype, "save").mockRejectedValue(new Error("User validation failed: `email` is required"));

    const user = new User({
      name: mockUserUser.name,
      email: "",
      password: mockUserUser.password,
      age: mockUserUser.age,
    });

    await expect(user.save()).rejects.toThrow("User validation failed: `email` is required");

    saveMock.mockRestore();
  });

  it("should throw an error if the user's password is missing", async () => {
    const saveMock = jest.spyOn(User.prototype, "save").mockRejectedValue(new Error("User validation failed: `password` is required"));

    const user = new User({
      name: mockUserUser.name,
      email: mockUserUser.email,
      password: "",
      age: mockUserUser.age,
    });

    await expect(user.save()).rejects.toThrow("User validation failed: `password` is required");
    saveMock.mockRestore();
  });

  it("should throw an error if the user's age is missing", async () => {
    const saveMock = jest.spyOn(User.prototype, "save").mockRejectedValue(new Error("User validation failed: `age` is required"));

    const user = new User({
      name: mockUserUser.name,
      email: mockUserUser.email,
      password: mockUserUser.password,
      age: "",
    });

    await expect(user.save()).rejects.toThrow("User validation failed: `age` is required");
    saveMock.mockRestore();
    
  });
});
