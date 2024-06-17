// script for test framework environment
function add(a: number, b: number): number {
    return a + b;
  }
  
  // Write a test case for the add function
  describe('add function', () => {
    it('correctly adds two numbers', () => {
      expect(add(1, 2)).toBe(3);
    });
  });