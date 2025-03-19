describe("Math Utils", () => {
  describe("add function", () => {
    it("should correctly add two positive numbers", () => {
      expect(add(1, 2)).toBe(3);
    });

    it("should handle negative numbers", () => {
      expect(add(-1, 2)).toBe(1);
      expect(add(1, -2)).toBe(-1);
    });

    it("should handle zero", () => {
      expect(add(0, 5)).toBe(5);
      expect(add(5, 0)).toBe(5);
    });
  });
});
function add(arg0: number, arg1: number): number {
  return arg0 + arg1;
}
