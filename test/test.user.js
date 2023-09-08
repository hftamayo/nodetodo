process.env.NODE_ENV = "test";

// const { token } = require("morgan");
import mongoose from "mongoose";
import User from "../models/User.js";

import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server.js";
const expect = chai.expect;
const should = chai.should;

chai.use(chaiHttp);

describe("Adding a New User", () => {
  before(function () {});

  it("POST /nodetodo/users/register", (done) => {
    let testUser = {
      name: "tester7",
      email: "tester7@tamayo.com",
      password: "123456",
      age: 40,
    };
    chai
      .request(server)
      .post("/nodetodo/users/register")
      .send(testUser)
       .end((err, res) => {
        //expect(res).to.have.status(200);
        res.should.have.status(200);
        res.body.should.be.a("object");
        //res.body.should.have.property("message").eql("User Added");
        // res.body.testUser.should.have.property("name").eql(testUser.name);
        // res.body.testUser.should.have.property("email").eql(testUser.email);
        // res.body.testUser.should.have
        //   .property("password")
        //   .eql(testUser.password);
        // res.body.testUser.should.have.property("age").eql(testUser.age);
        done();
      });
  });
});
