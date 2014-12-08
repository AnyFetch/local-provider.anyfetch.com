'use strict';

require('should');
var request = require('supertest');

process.env.ANYFETCH_SETTINGS_URL = 'http://localhost:1337';
var app = require('../app.js');

describe("GET /init/connect", function() {
  it("should redirect to option page", function(done) {
    request(app).get('/init/connect?code=123')
      .expect(302)
      .expect('Location', /\/init\/options\?callback/)
      .end(done);
  });
});

describe("GET /init/options", function() {
  it("should ask the user to select the path of the directory", function(done) {
    request(app).get('/init/options?callback=test')
      .expect(200)
      .end(function(err, res) {
        if(err) {
          throw err;
        }

        res.text.should.containDeep('<form');
        res.text.should.containDeep('action="test"');
        res.text.should.containDeep('name="path"');

        done();
      });
  });
});

describe("GET /init/callback", function() {
  var retrieveTokens = require('../lib/index.js').connectFunctions.retrieveTokens;

  it("should check for path param", function(done) {
    var reqParams = {};

    retrieveTokens(reqParams, {}, function(err) {
      err.should.match(/Missing path/i);
      done();
    });
  });

  it("should check directory exists", function(done) {
    var reqParams = {
      path: '/lol-not-exist'
    };

    retrieveTokens(reqParams, {}, function(err) {
      err.should.match(/directory does not exist/i);
      done();
    });
  });

  it("should check path is not a file", function(done) {
    var reqParams = {
      path: __filename
    };

    retrieveTokens(reqParams, {}, function(err) {
      err.should.match(/is not a directory/i);
      done();
    });
  });
});
