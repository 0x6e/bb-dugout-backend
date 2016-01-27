'use strict'

var supertest = require('supertest');
var should = require('should');

var server = supertest.agent('http://localhost:8080');


describe("Dugout authentication API", function() {

  describe("Registration:", function() {

    it("should NOT register an empty username", function(done) {

      server.post("/api/signup")
      .send({name: "", password: "iamnuffle"})
      .expect("Content-type", /json/)
      .expect(200)
      .end( function(error, result) {
        result.status.should.equal(200);
        result.body.success.should.equal(false);
        done();
      });

    });

    it("should NOT register an empty password", function(done) {

      server.post("/api/signup")
      .send({name: "emptyPassword", password: ""})
      .expect("Content-type", /json/)
      .expect(200)
      .end( function(error, result) {
        result.status.should.equal(200);
        result.body.success.should.equal(false);
        done();
      });

    });

    it("should NOT register empty details", function(done) {

      server.post("/api/signup")
      .send({name: "", password: ""})
      .expect("Content-type", /json/)
      .expect(200)
      .end( function(error, result) {
        result.status.should.equal(200);
        result.body.success.should.equal(false);
        done();
      });

    });

    it("should NOT register an exact duplicate username", function(done) {

      server.post("/api/signup")
      .send({name: "Coach", password: "iamnuffle"})
      .expect("Content-type", /json/)
      .expect(200)
      .end( function(error, result) {
        result.status.should.equal(200);
        result.body.success.should.equal(false);
        done();
      });

    });

    it("should NOT register an username that only differs by case", function(done) {

      server.post("/api/signup")
      .send({name: "coach", password: "iamnuffle"})
      .expect("Content-type", /json/)
      .expect(200)
      .end( function(error, result) {
        result.status.should.equal(200);
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
      .expect(200)
      .end( function(error, result) {
        result.status.should.equal(200);
        result.body.success.should.equal(false);
        done();
      });

    });

    it("should NOT autheticate notCoach because the user doesn't exist", function(done) {

      server.post("/api/authenticate")
      .send({name: "notCoach", password: "iamnuffle"})
      .expect("Content-type", /json/)
      .expect(200)
      .end( function(error, result) {
        result.status.should.equal(200);
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
      .expect(200)
      .end( function(error, result) {
        result.status.should.equal(200);
        result.body.success.should.equal(false);
        done();
      });

    });

  });

});
