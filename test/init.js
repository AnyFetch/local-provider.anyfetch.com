'use strict';

require('should');
var request = require('supertest');
var CluestrProvider = require("cluestr-provider");

process.env.CLUESTR_FRONT = 'http://localhost:1337';
var app = require('../app.js');

describe("GET /init/connect", function () {
  it("should redirect to option page", function(done) {
    request(app).get('/init/connect?code=123')
      .expect(302)
      .expect('Location', /\/init\/options\?code=123/)
      .end(done);
  });
});

describe("GET /init/options", function () {
  it("should ask the user to select the path of the directory", function(done) {
    request(app).get('/init/options?code=123')
      .expect(200)
      .end(function(err, res) {
        if(err) {
          throw err;
        }

        res.text.should.include('<form');
        res.text.should.include('value="123"');
        res.text.should.include('name="path"');

        done();
      });
  });
});
