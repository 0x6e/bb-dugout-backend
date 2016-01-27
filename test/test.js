'use strict'

var supertest = require('supertest');
var should = require('should');

var server = supertest.agent('http://localhost:8080');


describe("Dugout authentication API", function() {
  
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
