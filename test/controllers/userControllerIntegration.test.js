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

    it("should login a user with valid credentials", async function () {
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

    it("should not login with invalid credentials", async function () {
      this.timeout(10000);
      const response = await request(server)
        .post("/nodetodo/users/login")
        .send({
          email: mockUserInvalid.email,
          password: mockUserInvalid.password,
        });
      expect(response.status).to.equal(404);
      expect(response.body.resultMessage).to.equal(
        "User or Password does not match"
      );
    });

    it("should logout a user", async function () {
      this.timeout(10000);
      const loginResponse = await request(server)
        .post("/nodetodo/users/login")
        .send({
          email: mockUser.email,
          password: mockUser.password,
        });
      expect(loginResponse.status).to.equal(200);
      expect(loginResponse.body.resultMessage).to.equal(
        "User login successfully"
      );

      const cookies = loginResponse.headers["set-cookie"];
      const nodetodoCookie = cookies.find((item) =>
        item.startsWith("nodetodo=")
      );
      expect(nodetodoCookie).to.exist;

      //bug en estas lineas
      const logoutResponse = await request(server)
        .post("/nodetodo/users/logout")
        .set("Cookie", nodetodoCookie);

      expect(logoutResponse.status).to.equal(200);
      expect(logoutResponse.body.msg).to.equal("User logged out successfully");

      const logoutCookies = logoutResponse.headers["set-cookie"];
      const clearedNodetodoCookie = logoutCookies.find((cookie) =>
        cookie.startsWith("nodetodo=")
      );
      expect(clearedNodetodoCookie).to.include("Expires="); // The cookie should have an 'Expires' attribute set to a past date
    });

    //no he considerado si un usuario no autorizado hace un request a logout

    // it("should not logout an unauthorized user", async function () {
    //   this.timeout(10000);
    //   const response = await request(server)
    //     .post("/nodetodo/users/logout");
    //   expect(response.status).to.equal(401);
    //   expect(response.body.resultMessage).to.equal("Unauthorized");
    // });

    it("should get the info of the logged user", async function () {
      this.timeout(10000);
      const loginResponse = await request(server)
        .post("/nodetodo/users/login")
        .send({
          email: mockUser.email,
          password: mockUser.password,
        });
      expect(loginResponse.status).to.equal(200);
      expect(loginResponse.body.resultMessage).to.equal(
        "User login successfully"
      );
      const cookies = loginResponse.headers["set-cookie"];
      const nodetodoCookie = cookies.find((item) =>
        item.startsWith("nodetodo=")
      );
      expect(nodetodoCookie).to.exist;

      const response = await request(server)
        .get("/nodetodo/users/me")
        .set("Cookie", nodetodoCookie);

      expect(response.status).to.equal(200);
      expect(response.body.resultMessage).to.equal("User Found");
      expect(response.body.searchUser).to.be.an("object");
      expect(response.body.searchUser).to.have.property("name", mockUser.name);
      expect(response.body.searchUser).to.have.property(
        "email",
        mockUser.email
      );
      expect(response.body.searchUser).to.have.property("age", mockUser.age);
    });
  });
});
