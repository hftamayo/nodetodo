const expect = require("chai").expect;
const mongoose = require("mongoose");
const User = require("../../models/User");
const { backend } = require("../../config/envvars");
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

before(async () => {
  try {
    await mongoose.connect(backend, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB Testing successfully");
    const start = Date.now();
    await User.findOne();
    const end = Date.now();
    console.log(`Elapsed time to execute a search query: ", ${end - start} ms`);
  } catch (error) {
    console.log("Error connecting to DB: ", error);
  }
});

after(async () => {
  await mongoose.connection.close();
});

describe("UserService Integration Test", () => {
  describe("signupUser() method", () => {
    it.only("should create a new user with valid data", async function () {
      this.timeout(60000);
      const requestBody = {
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
        age: mockUser.age,
      };
      try {
        const response = await signUpUser(requestBody);
        console.log("signUpUser response object: ", response);
      } catch (error) {
        console.log("signUpUser error: ", error);
      }
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

  describe("loginUser() method", () => {
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

  describe("listUserByID() method", () => {
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

  describe("updateUserByID() method", () => {
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

  describe("updateUserPassword() method", () => {
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

  describe("deleteUserByID() method", () => {
    it("should delete an existing user", async () => {
      const requestUserId = mockUserDelete.id;
      const response = await deleteUserByID(requestUserId);
      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("User deleted successfully");
    });
  });
});
