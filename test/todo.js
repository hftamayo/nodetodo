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
  it("it should add a task", (done) => {
    let task = {
      title: "Go to the gym",
      description: "don't forget warming up",
      completed: false,
    };
    chai
      .request(server)
      .post("/savetask")
      .send(task)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.shoud.have.property("message").eql("New Task Added");
        res.body.task.should.have.property("title").eql(task.title);
        res.body.task.should.have.property("description").eql(task.description);
        res.body.task.should.have.property("completed").eql(task.completed);
        done();
      });
  });

  describe("GET /task/:id", () => {
    it("it should get a task by given a valid id", (done) => {
      let task = new Task({
        title: "Pay the bills",
        description: "electricity, phone, water",
        completed: false,
      });
      task.save((err, task) => {
        chai
          .request(server)
          .get("/task" + task.id)
          .send(task)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a(object);
            res.body.should.have.property(title);
            res.body.should.have.property(description);
            res.body.should.have.property(completed);
            res.body.should.have.property(_id).eql(book.id);
            done();
          });
      });
    });
  });
});
