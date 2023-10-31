import { expect } from "chai";
import {
  signUpUser,
  loginUser,
  listUserByID,
  updateUserByID,
  updateUserPassword,
  deleteUserByID,
} from "../../services/userService";

describe("UserService Unit Tests", () => {
  describe("signupUser()", () => {
    it("should create a new user with valid data", async () => {
      const requestBody = {
        name: "Herbert Fernandez Tamayo",
        email: "hftamayo@gmail.com",
        password: "milucito",
        age: 40,
      };
      const response = await signUpUser(requestBody);
      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("User created successfully");
      expect(response.user).to.exist;
    });

    it("should return an error if the user's email is already in use", async () => {
      const requestBody = {
        name: "Herbert Fernandez Tamayo",
        email: "hftamayo@gmail.com",
        password: "milucito",
        age: 40,
      };
      await signUpUser(requestBody);

      const response = await signUpUser(requestBody);
      expect(response.httpStatusCode).to.equal(400);
      expect(response.message).to.equal("Email already exists");
    });
  });

  describe("loginUser()", () => {
    it("should login a user with valid credentials", async () => {
      const requestBody = {
        email: "hftamayo@gmail.com",
        password: "milucito",
      };
      const response = await loginUser(requestBody);
      expect(response.httpStatusCode).to.equal(200);
      expect(response.tokenCreated).to.exist;
      expect(response.message).to.equal("User login successfully");
      expect(response.user).to.exist;
    });
  });
});
