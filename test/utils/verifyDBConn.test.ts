import mongoose from "mongoose";
import verifyDBConn from "../../src/utils/verifyDBConn"; // Adjust the import path as necessary

jest.mock("mongoose");

describe("verifyDBConn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should log collection names when connection is successful", async () => {
    const mockCollections = [{ name: "collection1" }, { name: "collection2" }];

    (mongoose.connect as jest.Mock).mockResolvedValueOnce(undefined);
    (mongoose.connection.db.listCollections as jest.Mock).mockReturnValueOnce({
      toArray: jest.fn().mockResolvedValueOnce(mockCollections),
    });

    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    await verifyDBConn();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI);
    expect(consoleSpy).toHaveBeenCalledWith(
      "found collection %s",
      "collection1"
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "found collection %s",
      "collection2"
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Connection established with Data Repository: Remote"
    );

    consoleSpy.mockRestore();
  });

  it("should log an error message when connection fails", async () => {
    const errorMessage = "Connection failed";
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    await verifyDBConn();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Couldn't established connection with Data Repository, details: " +
        new Error(errorMessage)
    );

    consoleSpy.mockRestore();
  });
});
