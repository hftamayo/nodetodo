process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
let Task = require("../models/Todo");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

chai.use(chaiHttp);

describe("Setting the enviro for Users", () => {
  //before each test empty the database
  beforeEach((done) => {
    Task.remove({}, (err) => {
      done();
    });
  });

  describe("Get all Tasks", () => {
    it("it should GET all tasks", (done) => {
      chai
        .request(server)
        .get("/tasks")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
        done();
        });
    });
  });
});
