describe("Test Environment", () => {
  it("should have required Node version", () => {
    const nodeVersion = process.version;
    expect(nodeVersion).toMatch(/v20/);
  });

  it("should have correct environment variables", () => {
    expect(process.env.NODE_ENV).toBeDefined();
    // Add other critical env vars
  });

  it("should have access to required npm packages", () => {
    expect(require("mongoose")).toBeDefined();
    expect(require("jest")).toBeDefined();
    // Add other critical packages
  });
});
