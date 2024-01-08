const expect = require("chai").expect;
const {
  mockUser,
  mockUserInvalid,
  mockUserUpdate,
  mockUserDelete,
} = require("../mocks/user.mock");
const {
  signUpUser,
  loginUser,
  listUserByID,
  updateUserByID,
  updateUserPassword,
  deleteUserByID,
} = require("../../services/userService");

describe("UserService Unit Tests", () => {
  describe("signupUser()", () => {
    it("should create a new user with valid data", async () => {
      const requestBody = {
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
        age: mockUser.age,
      };
      const response = await signUpUser(requestBody);
      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("User created successfully");
      expect(response.user).to.exist;
      expect(user.name).to.equal(mockUser.name);
      expect(user.email).to.equal(mockUser.email);
      expect(user.age).to.equal(mockUser.age);
    });

    it("should return an error if the user's email is already in use", async () => {
      const requestBody = {
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
        age: mockUser.age,
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
        email: mockUser.email,
        password: mockUser.password,
      };
      const response = await loginUser(requestBody);
      expect(response.httpStatusCode).to.equal(200);
      expect(response.tokenCreated).to.exist;
      expect(response.message).to.equal("User login successfully");
      expect(response.user).to.exist;
      expect(user.name).to.equal(mockUser.name);
      expect(user.email).to.equal(mockUser.email);
      expect(user.age).to.equal(mockUser.age);
    });

    it("should not login if user does not exist", async () => {
      const requestBody = {
        email: mockUserInvalid.email,
        password: mockUser.password,
      };
      const response = await loginUser(requestBody);
      expect(response.httpStatusCode).to.equal(404);
      expect(response.message).to.equal("User or Password does not match");
    });

    it("should return an error if the password is incorrect", async () => {
      const requestBody = {
        email: mockUser.email,
        password: mockUserInvalid.password,
      };
      const response = await loginUser(requestBody);
      expect(response.httpStatusCode).to.equal(404);
      expect(response.message).to.equal("User or Password does not match");
    });
  });

  describe("listUserByID()", () => {
    it("should return a user with a valid ID", async () => {
      const requestUserId = mockUser.id;
      const response = await listUserByID(requestUserId);
      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("User Found");
      expect(response.user).to.exist;
      expect(user.name).to.equal(mockUser.name);
      expect(user.email).to.equal(mockUser.email);
      expect(user.age).to.equal(mockUser.age);
    });

    it("should return an error if the user ID is invalid", async () => {
      const requestUserId = mockUserInvalid.id;
      const response = await listUserByID(requestUserId);
      expect(response.httpStatusCode).to.equal(404);
      expect(response.message).to.equal("User Not Found");
    });
  });

  describe("updateUserByID()", () => {
    it("should update a user with valid data", async () => {
      const requestUserId = mockUserUpdate.id;
      const requestBody = {
        name: mockUserUpdate.name,
        email: mockUserUpdate.email,
        age: mockUserUpdate.age,
      };
      const response = await updateUserByID(requestUserId, requestBody);
      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("Data updated successfully");
      expect(response.user).to.exist;
      expect(user.name).to.equal(mockUserUpdate.name);
      expect(user.email).to.equal(mockUserUpdate.email);
      expect(user.age).to.equal(mockUserUpdate.age);
    });

    it("should not update if the amil has already taken", async () => {
      const requestUserId = mockUserUpdate.id;
      const requestBody = {
        name: mockUserUpdate.name,
        email: mockUserUpdate.emailTaken,
        age: mockUserUpdate.age,
      };
      const response = await updateUserByID(requestUserId, requestBody);
      expect(response.httpStatusCode).to.equal(400);
      expect(response.message).to.equal("Email already taken");
    });
  });

  describe("updateUserPassword()", () => {
    it("should update the password of a valid user", async () => {
      const requestUserId = mockUserUpdate.id;
      const requestPword = {
        password: mockUserUpdate.oldPassword,
        newPassword: mockUserUpdate.newPassword,
      };
      const response = await updateUserPassword(requestUserId, requestPword);
      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("Password updated successfully");
      expect(response.user).to.exist;
      expect(user.name).to.equal(mockUserUpdate.name);
      expect(user.email).to.equal(mockUserUpdate.email);
      expect(user.age).to.equal(mockUserUpdate.age);
    });

    it("should not update if current passwod did not match", async () => {
      const requestUserId = mockUserUpdate.id;
      const requestPword = {
        password: mockUserUpdate.notMatchPassword,
        newPassword: mockUserUpdate.newPassword,
      };
      const response = await updateUserPassword(requestUserId, requestPword);
      expect(response.httpStatusCode).to.equal(400);
      expect(response.message).to.equal(
        "The entered credentials are not valid"
      );
    });
  });

  describe("deleteUserByID()", () => {
    it("should delete an existing user", async () => {
      const requestUserId = mockUserDelete.id;
      const response = await deleteUserByID(requestUserId);
      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("User deleted successfully");
    });
  });
});
