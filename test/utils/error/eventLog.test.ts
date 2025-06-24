import { createLog, createApiError } from "@/utils/error/eventLog";
import { ErrorTypes, EventContext } from "@/types/event.types";

jest.mock("@/config/envvars", () => ({ mode: "development" }));

describe("eventLog utils", () => {
  let consoleDebugSpy: jest.SpyInstance;
  let consoleInfoSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  const context: EventContext = {
    path: "/test",
    method: "GET",
    domain: "test",
    cookiePresent: true,
  };

  beforeEach(() => {
    consoleDebugSpy = jest.spyOn(console, "debug").mockImplementation();
    consoleInfoSpy = jest.spyOn(console, "info").mockImplementation();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    consoleDebugSpy.mockRestore();
    consoleInfoSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("should create and log a debug event", () => {
    const entry = createLog("debug", "TEST", "Debug message", context);
    expect(entry.level).toBe("debug");
    expect(entry.section).toBe("TEST");
    expect(entry.message).toBe("Debug message");
    expect(entry.context).toEqual(context);
    expect(consoleDebugSpy).toHaveBeenCalledWith(
      expect.stringContaining("[TEST][DEBUG]")
    );
  });

  it("should create and log an info event", () => {
    const entry = createLog("info", "TEST", "Info message", context);
    expect(entry.level).toBe("info");
    expect(entry.section).toBe("TEST");
    expect(entry.message).toBe("Info message");
    expect(entry.context).toEqual(context);
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining("[TEST][INFO]")
    );
  });

  it("should create and log an error event", () => {
    const entry = createLog("error", "TEST", "Error message", context);
    expect(entry.level).toBe("error");
    expect(entry.section).toBe("TEST");
    expect(entry.message).toBe("Error message");
    expect(entry.context).toEqual(context);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("[TEST][ERROR]")
    );
  });

  it("should create and log an API error event for each error type", () => {
    (Object.keys(ErrorTypes) as (keyof typeof ErrorTypes)[]).forEach((type) => {
      const error = createApiError(
        type,
        `Error for ${type}`,
        "debug info",
        context
      );
      expect(error.level).toBe("error");
      expect(error.section).toBe("API_ERROR");
      expect(error.code).toBe(ErrorTypes[type].code);
      expect(error.resultMessage).toBe(ErrorTypes[type].message);
      expect(error.message).toBe(`Error for ${type}`);
      expect(error.debugMessage).toBe("debug info");
      expect(error.context).toEqual(context);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("[API_ERROR][ERROR]")
      );
    });
  });

  it("should not include context if not provided", () => {
    const entry = createLog("info", "TEST", "No context");
    expect(entry.context).toBeUndefined();
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining("[TEST][INFO]")
    );
  });
});
