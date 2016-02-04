'use strict'

var supertest = require('supertest');
var should = require('should');

var server = supertest.agent('http://localhost:8080');


describe("Dugout authentication API", function() {

  describe("Registration:", function() {
    // Mongolab might take a while to respond, so set a high timeout
    this.timeout(30000);

    it("should NOT register an empty username", function(done) {

      server.post("/api/signup")
      .send({name: "", password: "iamnuffle"})
      .expect("Content-type", /json/)
      .expect(409)
      .end( function(error, result) {
        result.status.should.equal(409);
        result.body.success.should.equal(false);
        done();
      });

    });

    it("should NOT register an empty password", function(done) {

      server.post("/api/signup")
      .send({name: "emptyPassword", password: ""})
      .expect("Content-type", /json/)
      .expect(409)
      .end( function(error, result) {
        result.status.should.equal(409);
        result.body.success.should.equal(false);
        done();
      });

    });

    it("should NOT register empty details", function(done) {

      server.post("/api/signup")
      .send({name: "", password: ""})
      .expect("Content-type", /json/)
      .expect(409)
      .end( function(error, result) {
        result.status.should.equal(409);
        result.body.success.should.equal(false);
        done();
      });

    });

    it("should register a new user with corret details", function(done) {

      server.post("/api/signup")
      .send({name: "SignupTestCoach", password: "testing"})
      .expect("Content-Type", /json/)
      .expect(201)
      .end( function(error, result) {
        result.status.should.equal(201);
        result.body.success.should.equal(true);
        done();
      });

    });

    it("should NOT register an exact duplicate username", function(done) {

      server.post("/api/signup")
      .send({name: "SignupTestCoach", password: "testing"})
      .expect("Content-type", /json/)
      .expect(409)
      .end( function(error, result) {
        result.status.should.equal(409);
        result.body.success.should.equal(false);
        done();
      });

    });

    it("should NOT register an username that only differs by case", function(done) {

      server.post("/api/signup")
      .send({name: "SignupTESTCoach", password: "testing"})
      .expect("Content-type", /json/)
      .expect(409)
      .end( function(error, result) {
        result.status.should.equal(409);
        result.body.success.should.equal(false);
        done();
      });

    });

  });

  describe("Authentication:", function() {

    it("should NOT autheticate because no details were submitted", function(done) {

      server.post("/api/authenticate")
      .send({})
      .expect("Content-type", /json/)
      .expect(401)
      .end( function(error, result) {
        result.status.should.equal(401);
        result.body.success.should.equal(false);
        done();
      });

    });

    it("should NOT autheticate notCoach because the user doesn't exist", function(done) {

      server.post("/api/authenticate")
      .send({name: "notCoach", password: "iamnuffle"})
      .expect("Content-type", /json/)
      .expect(401)
      .end( function(error, result) {
        result.status.should.equal(401);
        result.body.success.should.equal(false);
        done();
      });

    });

    it("should autheticate Coach with a valid password", function(done) {

      server.post("/api/authenticate")
      .send({name: "Coach", password: "iamnuffle"})
      .expect("Content-type", /json/)
      .expect(200)
      .end( function(error, result) {
        result.status.should.equal(200);
        result.body.success.should.equal(true);
        done();
      });

    });

    it("should NOT autheticate Coach becuase he used an invalid password", function(done) {

      server.post("/api/authenticate")
      .send({name: "Coach", password: "notmypassword"})
      .expect("Content-type", /json/)
      .expect(401)
      .end( function(error, result) {
        result.status.should.equal(401);
        result.body.success.should.equal(false);
        done();
      });

    });

  });

});
