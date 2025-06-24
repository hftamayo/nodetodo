import seedDatabase from "@/utils/seedDatabase";
import mongoose from "mongoose";
import seedTodos from "@/utils/seedTodos";
import * as envvars from "@/config/envvars";

jest.mock("mongoose");
jest.mock("@/utils/seedTodos");

const mockSession = {
  startTransaction: jest.fn(),
  commitTransaction: jest.fn().mockResolvedValue(undefined),
  abortTransaction: jest.fn().mockResolvedValue(undefined),
  endSession: jest.fn(),
};

(mongoose.startSession as jest.Mock).mockResolvedValue(mockSession);

const originalEnv = { ...envvars };

describe("seedDatabase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (seedTodos as jest.Mock).mockResolvedValue(undefined);
    (envvars as any).mode = "development";
    (envvars as any).dataseeddev = "false";
    (envvars as any).dataseedprod = "false";
  });

  afterAll(() => {
    Object.assign(envvars, originalEnv);
  });

  it("should seed the database in dev mode when dataseeddev is true", async () => {
    (envvars as any).dataseeddev = "true";
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    await seedDatabase();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Seeding the database in")
    );
    expect(seedTodos).toHaveBeenCalledWith(mockSession);
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should seed the database in prod mode when dataseedprod is true", async () => {
    (envvars as any).dataseedprod = "true";
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    await seedDatabase();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Seeding the database in")
    );
    expect(seedTodos).toHaveBeenCalledWith(mockSession);
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should not seed the database if neither dataseeddev nor dataseedprod is true", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    await seedDatabase();
    expect(consoleSpy).toHaveBeenCalledWith("No seeding required");
    expect(seedTodos).not.toHaveBeenCalled();
    expect(mockSession.commitTransaction).not.toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should handle errors, abort transaction, log, and exit", async () => {
    (envvars as any).dataseeddev = "true";
    (seedTodos as jest.Mock).mockImplementation(() => { throw new Error("seed error"); });
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    const processSpy = jest.spyOn(process, "exit").mockImplementation(() => { throw new Error("process.exit called"); });
    await expect(seedDatabase()).rejects.toThrow("process.exit called");
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "error in seeding database, impossible to continue: ", "seed error"
    );
    expect(processSpy).toHaveBeenCalledWith(1);
    expect(mockSession.endSession).toHaveBeenCalled();
    consoleSpy.mockRestore();
    processSpy.mockRestore();
  });
}); 