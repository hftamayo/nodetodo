import { expect } from "chai";
import User from "../../models/User.js";
import express from "express";
import request from "supertest";
import app from "../../app.js";

describe("User Integration Tests", () => {
  let server;

  before(async () => {
    server = app.listen(8003);

    app.post("/nodetodo/users/register", async (req, res) => {
      const user = new User(req.body);
      await user.save();
      res.status(201).json(user);
    });
  });

  after(async () => {
    await server.close();
  });

  it.only("should create a new user when a POST request is sent to /register endpoint", async () => {
    const response = await request(server)
      .post("/nodetodo/users/register")
      .send({
        name: "Herbert Fernandez Tamayo",
        email: "hftamayo@gmail.com",
        password: "milucito",
        age: 40,
      });

    expect(response.status).to.equal(201);
    expect(response.body).to.exist;
    expect(response.body.name).to.equal("Herbert Fernandez Tamayo");
    expect(response.body.email).to.equal("hftamayo@gmail.com");
    expect(response.body.age).to.equal(40);
  });

  it("it should return an error if the user's name is missing when a POST request is sent to /register endpoint", async () => {
    const app = express();

    app.post("/nodetodo/users/register", async (req, res) => {
      const user = new User(req.body);
      await user.save();
      res.status(201).json(user);
    });

    const response = await request(app).post("/nodetodo/users/register").send({
      email: "hftamayo@gmail.com",
      password: "milucito",
      age: 40,
    });

    expect(response.status).to.equal(400);
    expect(response.body).to.exist;
    expect(response.body.message).to.equal(
      "User validation field: `name` is required "
    );
  });
});
