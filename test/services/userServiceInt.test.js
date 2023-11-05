import { expect } from "chai";
import Sinon from "sinon";
import { mockUser } from "../mocks/user.mock";
import { User, Todo } from "../../models";
import {
  signUpUser,
  loginUser,
  listUserByID,
  updateUserByID,
  updateUserPassword,
  deleteUserByID,
} from "../../services/userService";

describe("UserService Integration Tests", () => {
  mockUserRepository = sinon.createStubInstance({
    create: async () => mockUser,
    find: async (id) => {
      if (id === "1234567890") {
        return mockUser;
      } else {
        return null;
      }
    },
    update: async (id) => {
      if (id === "1234567890") {
        return mockUser;
      } else {
        return null;
      }
    },
    delete: async (id) => {
      return id === "1234567890";
    },
  });
});

afterEach(() => {
  sinon.restore();
});

describe("signUpUser()", () => {
  it("should create a new user with valid data", async () => {
    const requestBody = {
      name: "Herbert Fernandez Tamayo",
      email: "hftamayo@gmail.com",
      password: "password",
      age: 30,
    };

    const response = await signUpUser(requestBody);

    expect(response.httpStatusCode).to.equal(200);
    expect(response.message).to.equal("User created successfully");
    expect(response.user).to.exit;
  });
});

describe("loginUser()", () => {
  it("should log in a user with valid credentials", async () => {
    const requestBody = {
      email: "hftamayo@gmail.com",
      password: "password",
    };

    const response = await loginUser(requestBody);

    expect(response.httpStatusCode).to.equal(200);
    expect(response.tokenCreated).to.exist;
    expect(response.message).to.equal("User login successfully");
    expect(response.user).to.exist;
  });
});

describe("listUserByID()", () => {
  it("should return a user with a valid ID", async () => {
    const requestUserId = "1234567890";

    const response = await listUserByID(requestUserId);

    expect(response.httpStatusCode).to.equal(200);
    expect(response.message).to.equal("User Found");
    expect(response.user).to.exist;
  });
});

describe("updateUserByID()", () => {
  it("should update a user's data with valid data", async () => {
    const requestUserId = "1234567890";
    const requestBody = {
      name: "Sebastian Fernandez",
      email: "sebas@gmail.com",
      age: 35,
    };

    const response = await updateUserByID(requestUserId, requestBody);

    expect(response.httpStatusCode).to.equal(200);
    expect(response.message).to.equal("Data updated successfully");
    expect(response.user).to.exist;
  });
});

describe("updateUserPassWord()", () => {});

describe("deleteUser()", () => {});
