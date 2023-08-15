process.env.NODE_ENV = "test";

// const { token } = require("morgan");
import mongoose from "mongoose";
import User from "../models/User.js";
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../app.js";


let should = chai.should();

chai.use(chaiHttp);

describe("Add an account for testing", () => {
  it("POST /users/register", (done) => {
    let testUser = new User({
      name: "tester",
      email: "tester@tamayo.com",
      password: "123456",
      age: 40,
    });
    chai
      .request(server)
      .post("/users/register")
      .send(testUser)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        //res.body.should.have.property("message").eql("User Added");
        res.body.testUser.should.have.property("name").eql(testUser.name);
        res.body.testUser.should.have.property("email").eql(testUser.email);
        res.body.testUser.should.have
          .property("password")
          .eql(testUser.password);
        res.body.testUser.should.have.property("age").eql(testUser.age);
        done();
      });
  });
});
