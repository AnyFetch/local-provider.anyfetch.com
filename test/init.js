'use strict';

require('should');
var request = require('supertest');
var AnyFetchProvider = require("anyfetch-provider");

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

describe("GET /init/callback", function () {
  var frontServer = AnyFetchProvider.debug.createTestFrontServer();
  frontServer.listen(1337);

  it("should check for path param", function(done) {
    request(app).get('/init/callback?code=123')
      .expect(500)
      .end(function(err, res) {
        if(err) {
          throw err;
        }

        res.text.should.include('Missing path');

        done();
      });
  });

  it("should check directory exists", function(done) {
    request(app).get('/init/callback?code=123&path=/lol-not-exist')
      .expect(500)
      .end(function(err, res) {
        if(err) {
          throw err;
        }

        res.text.should.include('directory does not exist');

        done();
      });
  });

  it("should check path is not a file", function(done) {
    request(app).get('/init/callback?code=123&path=' + __filename)
      .expect(500)
      .end(function(err, res) {
        if(err) {
          throw err;
        }

        res.text.should.include('is not a directory');

        done();
      });
  });

  it("should work with valid path", function(done) {
    request(app).get('/init/callback?code=123&path=' + __dirname)
      .expect(302)
      .end(done);
  });
});
