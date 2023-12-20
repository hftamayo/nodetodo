import request from "supertest";
import { expect } from "chai";
import server from "../../server.js";
//import app from "../../app";
import {
  mockUser,
  mockUserInvalid,
  mockUserUpdate,
  mockUserDelete,
} from "../mocks/user.mock.js";

describe("User Controller Integration Test", function () {
  this.timeout(10000);
  describe("POST /nodetodo/users/register", function () {
    this.timeout(10000);
    it("should register a new user", async function () {
      this.timeout(10000);
      const response = await request(server)
        .post("/nodetodo/users/register")
        .send({
          name: mockUser.name,
          email: mockUser.email,
          password: mockUser.password,
          age: mockUser.age,
        });
      expect(response.status).to.equal(200);
      expect(response.body.resultMessage).to.equal("User created successfully");
      expect(response.body.newUser).to.be.an("object");
      expect(response.body.newUser).to.have.property("name", mockUser.name);
      expect(response.body.newUser).to.have.property("email", mockUser.email);
      expect(response.body.newUser).to.have.property("age", mockUser.age);
    });

    it("should not register an existing user", async function () {
      this.timeout(10000);
      const response = await request(server)
        .post("/nodetodo/users/register")
        .send({
          name: mockUser.name,
          email: mockUser.email,
          password: mockUser.password,
          age: mockUser.age,
        });
      expect(response.status).to.equal(400);
      expect(response.body.resultMessage).to.equal("Email already exists");
    });

    it.only("should login a user with valid credentials", async function () {
      this.timeout(10000);
      const response = await request(server)
        .post("/nodetodo/users/login")
        .send({
          email: mockUser.email,
          password: mockUser.password,
        });
      expect(response.status).to.equal(200);
      expect(response.body.resultMessage).to.equal("User login successfully");
      expect(response.body.loggedUser).to.be.an("object");
      expect(response.body.loggedUser).to.have.property("name", mockUser.name);
      expect(response.body.loggedUser).to.have.property(
        "email",
        mockUser.email
      );
      expect(response.body.loggedUser).to.have.property("age", mockUser.age);
    });
  });
});
