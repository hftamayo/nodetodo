process.env.NODE_ENV = "test";

// const { token } = require("morgan");
import mongoose from "mongoose";
import User from "../models/User.js";
import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server.js";
const expect = chai.expect;
chai.use(chaiHttp);

describe("Add an account for testing", () => {
  before(function() {
    proxy = process.env.CSJ_PROXY;
  });


  it("POST /nodetodo/users/register", (done) => {
    // let testUser = new User({
    //   name: "tester",
    //   email: "tester@tamayo.com",
    //   password: "123456",
    //   age: 40,
    // });
    chai
      .request(server)
      .post("/nodetodo/users/register")
      .send({
        name: "tester5",
        email: "tester5@tamayo.com",
        password: "123456",
        age: 40,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        //expect(res.body).to.have.property("name").eql("tester4");
        //res.should.have.status(200);
        // res.body.should.be.a("object");
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
