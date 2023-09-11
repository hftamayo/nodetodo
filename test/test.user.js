process.env.NODE_ENV = "test";

// const { token } = require("morgan");
import mongoose from "mongoose";
import User from "../models/User.js";

import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server.js";
const should = chai.should();

chai.use(chaiHttp);

describe("Adding a New User Successfully", () => {
  before(function () {});

  it("POST /nodetodo/users/register", (done) => {
    let testUser = {
      name: "tester28",
      email: "tester28@tamayo.com",
      password: "123456",
      age: 40,
    };
    chai
      .request(server)
      .post("/nodetodo/users/register")
      .send(testUser)
      .end((err, res) => {
        res.should.have.status(200);
        should.exist(res.body);
        res.body.should.be.a("object");
        res.body.should.have
          .property("msg")
          .eql("User created successfully. Please log in");
        // assets en caso que el metodo devuelva el registro:
        //res.body.testUser.should.have.property('name');
        //res.body.testUser.should.have.property("name").eql(testUser.name);
        // res.body.testUser.should.have.property("email").eql(testUser.email);
        // res.body.testUser.should.have
        //   .property("password")
        //   .eql(testUser.password);
        // res.body.testUser.should.have.property("age").eql(testUser.age);
        done();
      });
  });
});

describe("POST /nodetodo/users/login", () => {
  it.only("trying to login with valid credentials", (done) => {
    let validUser = {
      email: "tester23@tamayo.com",
      password: "123456",
    };
    chai
      .request(server)
      .post("/nodetodo/users/login")
      .send(validUser)
      .end((err, res) => {
        res.should.have.status(200);
        should.exist(res.body);
        res.body.should.be.a("object");
        res.body.validUser.should.have.property("email");
        res.body.validUser.should.have.property("password");
        done();
      });
  });

  it.only("trying to login with invalid email", (done) => {
    let validUser = {
      email: "tester99@tamayo.com",
      password: "123456",
    };
    chai
      .request(server)
      .post("/nodetodo/users/login")
      .send(validUser)
      .end((err, res) => {
        res.should.have.status(404);
        should.exist(res.body);
        res.body.should.be.a("object");
        res.body.should.have.property("msg");
        res.body.msg.should.have.property("message");
        res.body.msgshould.have.property("message").eql("User or Password does not match");
        done();
      });
  });

  it.only("trying to login with invalid password", (done) => {
    let validUser = {
      email: "tester23@tamayo.com",
      password: "12345600",
    };
    chai
      .request(server)
      .post("/nodetodo/users/login")
      .send(validUser)
      .end((err, res) => {
        res.should.have.status(404);
        should.exist(res.body);
        res.body.should.be.a("object");
        res.body.should.have.property("msg");
        res.body.msg.should.have.property("message");
        res.body.msgshould.have.property("message").eql("User or Password does not match");
        done();
      });
  });  

  it.only("trying to login with invalid email and password", (done) => {
    let validUser = {
      email: "tester233@tamayo.com",
      password: "12345600",
    };
    chai
      .request(server)
      .post("/nodetodo/users/login")
      .send(validUser)
      .end((err, res) => {
        res.should.have.status(404);
        should.exist(res.body);
        res.body.should.be.a("object");
        res.body.should.have.property("msg");
        res.body.msg.should.have.property("message");
        res.body.msgshould.have.property("message").eql("User or Password does not match");
        done();
      });
  });    

});
