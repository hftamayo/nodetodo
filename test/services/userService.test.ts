const expect = require("chai").expect;
const sinon = require("sinon");
const {
  mockUserUser,
  mockUserInvalid,
  mockUserUpdate,
  mockUserDelete,
} = require("../mocks/user.mock");
const userService = require("../../src/services/userService");

describe("UserService Unit Tests", () => {
  afterEach(function () {
    sinon.restore();
  });

  describe("signupUser()", () => {
    it("should create a new user with valid data", async () => {
      const requestBody = {
        name: mockUserUser.name,
        email: mockUserUser.email,
        password: mockUserUser.password,
        age: mockUserUser.age,
      };

      const mockResponse = {
        httpStatusCode: 200,
        message: "User created successfully",
        user: mockUserUser,
      };

      sinon.stub(userService, "signUpUser").resolves(mockResponse);

      const response = await userService.signUpUser(requestBody);

      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("User created successfully");
      expect(response.user).to.exist;
      expect(response.user.name).to.equal(mockUserUser.name);
      expect(response.user.email).to.equal(mockUserUser.email);
      expect(response.user.age).to.equal(mockUserUser.age);
    });

    it("should return an error if the user's email is already in use", async () => {
      const requestBody = {
        name: mockUserUser.name,
        email: mockUserUser.email,
        password: mockUserUser.password,
        age: mockUserUser.age,
      };

      const mockResponse = {
        httpStatusCode: 400,
        message: "Email already exists",
      };

      sinon.stub(userService, "signUpUser").resolves(mockResponse);

      const response = await userService.signUpUser(requestBody);

      expect(response.httpStatusCode).to.equal(400);
      expect(response.message).to.equal("Email already exists");
    });
  });

  describe("loginUser()", () => {
    it("should login a user with valid credentials", async () => {
      const requestBody = {
        email: mockUserUser.email,
        password: mockUserUser.password,
      };

      const mockResponse = {
        httpStatusCode: 200,
        tokenCreated: "token",
        message: "User login successfully",
        user: mockUserUser,
      };

      sinon.stub(userService, "loginUser").resolves(mockResponse);

      const response = await userService.loginUser(requestBody);

      expect(response.httpStatusCode).to.equal(200);
      expect(response.tokenCreated).to.exist;
      expect(response.message).to.equal("User login successfully");
      expect(response.user).to.exist;
      expect(response.user.name).to.equal(mockUserUser.name);
      expect(response.user.email).to.equal(mockUserUser.email);
      expect(response.user.age).to.equal(mockUserUser.age);
    });

    it("should not login if user does not exist", async () => {
      const requestBody = {
        email: mockUserInvalid.email,
        password: mockUserUser.password,
      };

      const mockResponse = {
        httpStatusCode: 404,
        message: "User or Password does not match",
      };

      sinon.stub(userService, "loginUser").resolves(mockResponse);

      const response = await userService.loginUser(requestBody);

      expect(response.httpStatusCode).to.equal(404);
      expect(response.message).to.equal("User or Password does not match");
    });

    it("should return an error if the password is incorrect", async () => {
      const requestBody = {
        email: mockUserUser.email,
        password: mockUserInvalid.password,
      };

      const mockResponse = {
        httpStatusCode: 404,
        message: "User or Password does not match",
      };

      sinon.stub(userService, "loginUser").resolves(mockResponse);

      const response = await userService.loginUser(requestBody);

      expect(response.httpStatusCode).to.equal(404);
      expect(response.message).to.equal("User or Password does not match");
    });
  });

  describe("listUserById()", () => {
    it("should return a user with valid id", async () => {
      const requestUserId = mockUserUser.id;

      const mockResponse = {
        httpStatusCode: 200,
        message: "User Found",
        user: mockUserUser,
      };

      sinon.stub(userService, "listUserByID").resolves(mockResponse);

      const response = await userService.listUserByID(requestUserId);

      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("User Found");
      expect(response.user).to.exist;
      expect(response.user.name).to.equal(mockUserUser.name);
      expect(response.user.email).to.equal(mockUserUser.email);
      expect(response.user.age).to.equal(mockUserUser.age);
    });

    it("should return an error if the user id is invalid", async () => {
      const requestUserId = mockUserInvalid.id;

      const mockResponse = {
        httpStatusCode: 404,
        message: "User Not Found",
      };

      sinon.stub(userService, "listUserByID").resolves(mockResponse);

      const response = await userService.listUserByID(requestUserId);

      expect(response.httpStatusCode).to.equal(404);
      expect(response.message).to.equal("User Not Found");
    });
  });

  describe("updateUser()", () => {
    it("should update a user with valid data", async () => {
      const requestBody = {
        id: mockUserUpdate.id,
        name: mockUserUpdate.name,
        email: mockUserUpdate.email,
        oldPassword: mockUserUpdate.oldPassword,
        newPassword: mockUserUpdate.newPassword,
        age: mockUserUpdate.age,
      };

      const mockResponse = {
        httpStatusCode: 200,
        message: "User updated successfully",
        user: mockUserUpdate,
      };

      sinon.stub(userService, "updateUserByID").resolves(mockResponse);

      const response = await userService.updateUserByID(requestBody);

      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("User updated successfully");
      expect(response.user).to.exist;
      expect(response.user.name).to.equal(mockUserUpdate.name);
      expect(response.user.email).to.equal(mockUserUpdate.email);
      expect(response.user.age).to.equal(mockUserUpdate.age);
    });

    it("should not update if the user has already taken", async () => {
      const requestBody = {
        id: mockUserUpdate.id,
        name: mockUserUpdate.name,
        email: mockUserUpdate.emailTaken,
        oldPassword: mockUserUpdate.oldPassword,
        newPassword: mockUserUpdate.newPassword,
        age: mockUserUpdate.age,
      };

      const mockResponse = {
        httpStatusCode: 400,
        message: "Email already taken",
      };

      sinon.stub(userService, "updateUserByID").resolves(mockResponse);

      const response = await userService.updateUserByID(requestBody);

      expect(response.httpStatusCode).to.equal(400);
      expect(response.message).to.equal("Email already taken");
    });

    it("should not update if current passwod did not match", async () => {
      const requestBody = {
        id: mockUserUpdate.id,
        name: mockUserUpdate.name,
        email: mockUserUpdate.email,
        oldPassword: mockUserUpdate.notMatchPassword,
        newPassword: mockUserUpdate.newPassword,
        age: mockUserUpdate.age,
      };

      const mockResponse = {
        httpStatusCode: 400,
        message: "Password does not match",
      };

      sinon.stub(userService, "updateUserByID").resolves(mockResponse);

      const response = await userService.updateUserByID(requestBody);

      expect(response.httpStatusCode).to.equal(400);
      expect(response.message).to.equal("Password does not match");
    });

    it("should update the password of a valid user", async () => {
      const requestBody = {
        id: mockUserUpdate.id,
        name: mockUserUpdate.name,
        email: mockUserUpdate.email,
        oldPassword: mockUserUpdate.oldPassword,
        newPassword: mockUserUpdate.newPassword,
        age: mockUserUpdate.age,
      };

      const mockResponse = {
        httpStatusCode: 200,
        message: "Password updated successfully",
        user: mockUserUpdate,
      };

      sinon.stub(userService, "updateUserPassword").resolves(mockResponse);

      const response = await userService.updateUserPassword(requestBody);

      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("Password updated successfully");
      expect(response.user).to.exist;
      expect(response.user.name).to.equal(mockUserUpdate.name);
      expect(response.user.email).to.equal(mockUserUpdate.email);
      expect(response.user.age).to.equal(mockUserUpdate.age);
    });
  });

  describe("deleteUser()", () => {
    it("should delete a user with valid id", async () => {
      const requestUserId = mockUserDelete.id;

      const mockResponse = {
        httpStatusCode: 200,
        message: "User deleted successfully",
      };

      sinon.stub(userService, "deleteUserByID").resolves(mockResponse);

      const response = await userService.deleteUserByID(requestUserId);

      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("User deleted successfully");
    });

    it("should return an error if the user id is invalid", async () => {
      const requestUserId = mockUserInvalid.id;

      const mockResponse = {
        httpStatusCode: 404,
        message: "User Not Found",
      };

      sinon.stub(userService, "deleteUserByID").resolves(mockResponse);

      const response = await userService.deleteUserByID(requestUserId);

      expect(response.httpStatusCode).to.equal(404);
      expect(response.message).to.equal("User Not Found");
    });
  });
});
