process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
let Task = require("../models/Todo");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
const { token } = require("morgan");
let should = chai.should();

chai.use(chaiHttp);

describe("setting up / cleaning the environment", () => {
  //before each test empty the database
  beforeEach((done) => {
    let newTask = new Task({
      title: "take the dog to the vet",
      description: "set the appointment to this sunday",
      completed: false,
    });
    newTask.save((error, task) => {
      done();
    });

    chai
      .request(server)
      .post("/users/register")
      .send({
        name: "tester",
        email: "tester@tamayo.com",
        password: "123456",
        age: 40,
      })
      .end((error, res) => {
        res.should.have.status(201);
      });

    chai
      .request(server)
      .post("/users/login")
      .send({
        email: "tester@tamayo.com",
        password: "123456",
      })
      .end((error, res) => {
        res.should.have.status(201);
        res.body.should.have.property("token");
        const authenticatedToken = res.body.token;
      });
  });

  afterEach((done) => {
    Task.collection
      .drop()
      .then(() => {
        console.log("test data dropped successfully");
      })
      .catch(() => {
        console.log("data collection may not exists");
      });
    done();
  });

  describe("GET /tasks", () => {
    it("it should GET all tasks", (done) => {
      chai
        .request(server)
        .get("/tasks")
        .set("Authorization", "JWT" + authenticatedToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(1);
          res.body[0].should.have.property("title");
          res.body[0].should.have.property("description");
          res.body[0].should.have.property("completed");
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
      .set("Authorization", "JWT" + authenticatedToken)      
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
      .set("Authorization", "JWT" + authenticatedToken)      
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
          .set("Authorization", "JWT" + authenticatedToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a(object);
            res.body.should.have.property("title");
            res.body.should.have.property("description");
            res.body.should.have.property("completed");
            res.body.should.have.property("_id").eql(book.id);
            done();
          });
      });
    });
  });

  describe("PUT /updatetask/:id", () => {
    it("it should update a task given the id", (done) => {
      let task = new Task({
        title: "buy fruits",
        description: "we need them for break times",
        completed: false,
      });
      task.save((err, task) => {
        chai
          .request(server)
          .put("/updatetask" + task.id)
          .send({
            title: "buy fruits and veggies",
            description: "we need them for break times",
            completed: false,
          })
          .set("Authorization", "JWT" + authenticatedToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("Task updated");
            res.body.task.should.have
              .property("title")
              .eql("buy fruits and veggies");
            done();
          });
      });
    });
  });

  describe("DELETE deletetask/:id", () => {
    it("it should delete a task given the id", (done) => {
      let task = new Task({
        title: "go to the supermarket",
        description: "please dont forget the list",
        completed: false,
      });
      task.save((err, task) => {
        chai
          .request(server)
          .delete("/deletetask/" + task.id)
          .set("Authorization", "JWT" + authenticatedToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a(object);
            res.body.should.have.property("message").eql("Task deleted");
            res.body.result.should.have.property("ok").eql(1);
          });
      });
    });
  });
});
