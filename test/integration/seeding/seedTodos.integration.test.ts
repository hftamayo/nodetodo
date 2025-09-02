import seedTodos from "@/utils/seedTodos";
import Todo from "@models/Todo";
import seedUsers from "@/utils/seedUsers";
import mongoose from "mongoose";

jest.mock("@models/Todo");
jest.mock("@/utils/seedUsers");

const mockSession = {} as mongoose.ClientSession;

const mockUsers = [
  { _id: "user1", email: "bob@tamayo.com" },
  { _id: "user2", email: "mary@tamayo.com" },
];

describe("seedTodos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (seedUsers as jest.Mock).mockResolvedValue(mockUsers);
  });

  it("should delete all todos and create new ones", async () => {
    (Todo.deleteMany as jest.Mock).mockReturnValue({
      session: jest.fn().mockResolvedValue(undefined),
    });
    (Todo.create as jest.Mock).mockResolvedValue([
      { _id: "todo1", title: "Foreign language class" },
    ]);
    const consoleSpy = jest.spyOn(console, "log");

    const result = await seedTodos(mockSession);

    expect(seedUsers).toHaveBeenCalledWith(mockSession);
    expect(Todo.deleteMany).toHaveBeenCalledWith({});
    expect(Todo.create).toHaveBeenCalled();
    // Check that console.log was called with the expected arguments
    expect(consoleSpy).toHaveBeenCalledWith(
      "Todos created: ",
      expect.arrayContaining([
        expect.objectContaining({
          _id: "todo1",
          title: "Foreign language class"
        })
      ])
    );
    consoleSpy.mockRestore();
  });

  it("should handle errors and log them", async () => {
    (Todo.deleteMany as jest.Mock).mockImplementation(() => {
      throw new Error("delete error");
    });
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const result = await seedTodos(mockSession);
    expect(consoleSpy).toHaveBeenCalledWith("seedTodos: ", "delete error");
    expect(result).toBeUndefined();
    consoleSpy.mockRestore();
  });

  it("should return undefined if users are not found", async () => {
    (seedUsers as jest.Mock).mockResolvedValue(undefined);
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const result = await seedTodos(mockSession);
    expect(consoleSpy).toHaveBeenCalledWith("seedTodos: ", "Users not found in the database");
    expect(result).toBeUndefined();
    consoleSpy.mockRestore();
  });

  it("should return undefined if user Bob is not found", async () => {
    (seedUsers as jest.Mock).mockResolvedValue([
      { _id: "user2", email: "mary@tamayo.com" },
    ]);
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const result = await seedTodos(mockSession);
    expect(consoleSpy).toHaveBeenCalledWith("seedTodos: ", "User Bob not found in the database");
    expect(result).toBeUndefined();
    consoleSpy.mockRestore();
  });
});
