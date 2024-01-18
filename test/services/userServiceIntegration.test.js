const expect = require("chai").expect;
const mongoose = require("mongoose");
const { backend } = require("../../config/envvars");
const {
  mockUser,
  newUser,
  mockUserLogin,
  mockUserInvalid,
  mockUserUpdate,
} = require("../mocks/user.mock");
const {
  signUpUser,
  loginUser,
  listUserByID,
  updateUserByID,
  updateUserPassword,
  deleteUserByID,
} = require("../../services/userService");

let availableUser;

before(async function () {
  this.timeout(60000);
  try {
    await mongoose.connect(backend, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB Testing successfully");

    const userToUpdate = {
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
      age: mockUser.age,
    };

    const newUser = await signUpUser(userToUpdate);
    const start = Date.now();
    availableUser = await listUserByID(newUser.user._id);
    const end = Date.now();
    console.log("user available for update/delete methods: ", availableUser);
    console.log(`Elapsed time to execute a search query: ", ${end - start} ms`);
  } catch (error) {
    console.log("Error connecting to DB: ", error);
  }
});

after(async function () {
  this.timeout(60000);
  await mongoose.connection.close();
});

describe("UserService Integration Test", () => {
  describe("signupUser() method", () => {
    it("should create a new user with valid data", async function () {
      this.timeout(60000);
      const requestBody = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        age: newUser.age,
      };
      let response;
      try {
        response = await signUpUser(requestBody);
        console.log("signUpUser Service method response object: ", response);
      } catch (error) {
        console.log("signUpUser Service method error: ", error);
      }
      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("User created successfully");
      expect(response.user).to.exist;
      expect(response.user.name).to.equal(newUser.name);
      expect(response.user.email).to.equal(newUser.email);
      expect(response.user.age).to.equal(newUser.age);
    });

    it("should return an error if the user's email is already in use", async function () {
      this.timeout(60000);
      const requestBody = {
        name: mockUserLogin.name,
        email: mockUserLogin.email,
        password: mockUserLogin.password,
        age: mockUserLogin.age,
      };
      let response;
      try {
        response = await signUpUser(requestBody);
        console.log("signUpUser Service method response object: ", response);
      } catch (error) {
        console.log("signUpUser Service method error: ", error);
      }
      expect(response.httpStatusCode).to.equal(400);
      expect(response.message).to.equal("Email already exists");
    });
  });

  describe("loginUser() method", () => {
    it("should login a user with valid credentials", async function () {
      this.timeout(60000);
      const requestBody = {
        email: mockUserLogin.email,
        password: mockUserLogin.password,
      };
      let response;
      try {
        response = await loginUser(requestBody);
        console.log("loginUser Service method response object: ", response);
      } catch (error) {
        console.log("loginUser Service method error: ", error);
      }
      expect(response.httpStatusCode).to.equal(200);
      expect(response.tokenCreated).to.exist;
      expect(response.message).to.equal("User login successfully");
      expect(response.user).to.exist;
      expect(response.user.name).to.equal(mockUserLogin.name);
      expect(response.user.email).to.equal(mockUserLogin.email);
      expect(response.user.age).to.equal(mockUserLogin.age);
    });

    it("should not login if user does not exist", async function () {
      const requestBody = {
        email: mockUserInvalid.email,
        password: mockUser.password,
      };
      let response;
      try {
        response = await loginUser(requestBody);
        console.log("loginUser Service method response object: ", response);
      } catch (error) {
        console.log("loginUser Service method error: ", error);
      }
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
    it("should return a user with a valid ID", async function () {
      this.timeout(60000);
      let response;
      const requestUserId = mockUserLogin.id;
      try {
        response = await listUserByID(requestUserId);
        console.log("listUserByID Service method response object: ", response);
      } catch (error) {
        console.log("listUserByID Service method error: ", error);
      }
      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("User Found");
      expect(response.user).to.exist;
      expect(response.user.name).to.equal(mockUserLogin.name);
      expect(response.user.email).to.equal(mockUserLogin.email);
      expect(response.user.age).to.equal(mockUserLogin.age);
    });

    it("should return an error if the user ID is invalid", async function () {
      this.timeout(60000);
      let response;
      const requestUserId = mockUserInvalid.id;
      try {
        response = await listUserByID(requestUserId);
        console.log("listUserByID Service method response object: ", response);
      } catch (error) {
        console.log("listUserByID Service method error: ", error);
      }
      expect(response.httpStatusCode).to.equal(404);
      expect(response.message).to.equal("User Not Found");
    });
  });

  describe("updateUserByID() method", () => {
    it("should update a user with valid data", async function () {
      this.timeout(60000);

      let response;

      const requestBody = {
        name: mockUserUpdate.name,
        email: mockUserUpdate.email,
        age: mockUserUpdate.age,
      };
      try {
        const requestUserId = availableUser.user._id;

        response = await updateUserByID(requestUserId, requestBody);
        console.log(
          "updateUserByID Service method response object: ",
          response
        );
      } catch (error) {
        console.log("updateUserByID Service method error: ", error);
      }
      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("Data updated successfully");
      expect(response.user).to.exist;
      expect(response.user.name).to.equal(mockUserUpdate.name);
      expect(response.user.email).to.equal(mockUserUpdate.email);
      expect(response.user.age).to.equal(mockUserUpdate.age);
    });

    it("should not update if the email has already taken", async function () {
      this.timeout(60000);
      let response;

      try {

        const requestUserId = availableUser.user._id;

        const requestBody = {
          name: mockUserUpdate.name,
          email: mockUserLogin.email,
          age: mockUserUpdate.age,
        };

        console.log("Data to be updated: ", requestBody);

        response = await updateUserByID(requestUserId, requestBody);
        console.log(
          "updateUserByID Service method response object: ",
          response
        );
      } catch (error) {
        console.log("updateUserByID Service method error: ", error);
      }
      expect(response.httpStatusCode).to.equal(400);
      expect(response.message).to.equal("Email already taken");
    });
  });

  describe("updateUserPassword() method", () => {
    it("should update the password of a valid user", async function () {
      this.timeout(60000);
      let response;
      try {
        const requestUserId = availableUser.user._id;
        const oldPassword = mockUser.password;

        const requestPword = {
          password: oldPassword,
          newPassword: mockUserUpdate.newPassword,
        };

        console.log("Data to be updated: ", requestPword);

        response = await updateUserPassword(requestUserId, requestPword);
        console.log(
          "updateUserPassword Service method response object: ",
          response
        );
      } catch (error) {
        console.log("updateUserPassword Service method error: ", error);
      }
      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("Password updated successfully");
      expect(response.user).to.exist;
      expect(response.user.name).to.equal(mockUserUpdate.name);
      expect(response.user.email).to.equal(mockUserUpdate.email);
      expect(response.user.age).to.equal(mockUserUpdate.age);
    });

    it("should not update if current passwod did not match", async function () {
      this.timeout(60000);
      let response;
      const requestUserId = availableUser.user._id;

      const requestPword = {
        password: mockUserUpdate.notMatchPassword,
        newPassword: mockUserUpdate.newPassword,
      };

      console.log("Data to be updated: ", requestPword);

      try {
        response = await updateUserPassword(requestUserId, requestPword);
        console.log(
          "updateUserPassword Service method response object: ",
          response
        );
      } catch (error) {
        console.log("updateUserPassword Service method error: ", error);
      }
      expect(response.httpStatusCode).to.equal(400);
      expect(response.message).to.equal(
        "The entered credentials are not valid"
      );
    });
  });

  describe("deleteUserByID() method", () => {
    it("should delete an existing user", async function () {
      this.timeout(60000);
      let response;

      try {
        const requestUserId = availableUser.user._id;

        response = await deleteUserByID(requestUserId);
        console.log(
          "deleteUserByID Service method response object: ",
          response
        );
      } catch (error) {
        console.log("deleteUserByID Service method error: ", error);
      }
      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("User deleted successfully");
    });
  });
});
