process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
let Task = require("../models/Todo");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

chai.use(chaiHttp);

describe("cleaning dataset", () => {
  //before each test empty the database
  beforeEach((done) => {
    Task.remove({}, (err) => {
      done();
    });
  });

  describe("GET /tasks", () => {
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

describe("POST /savetask", () => {
  it("it shouldn't add a task without required fields", (done) => {
    let task = {
      title: "Go to the drugstore",
      completed: false,
    };
    chai
      .request(server)
      .post("/savetask")
      .send(task)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("errors");
        res.body.errors.should.have.property("description");
        res.body.errors.description.should.have
          .property("kind")
          .eql("required");
        done();
      });
  });

});
