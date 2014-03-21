'use strict';

var request = require('supertest');
var AnyFetchProvider = require('anyfetch-provider');
require('should');

var serverConfig = require('../lib/');


describe("Workflow", function () {

  var apiServer = AnyFetchProvider.debug.createTestApiServer();
  apiServer.listen(1338);

  before(AnyFetchProvider.debug.cleanTokens);
  before(function(done) {
    AnyFetchProvider.debug.createToken({
      anyfetchToken: 'fake_local_access_token',
      datas: {path: __dirname + '/sample'},
      cursor: {}
    }, done);
  });

  it("should upload datas to AnyFetch", function (done) {
    var originalQueueWorker = serverConfig.queueWorker;
    serverConfig.queueWorker = function(file, anyfetchClient, datas, cb) {
      file.should.have.property('path');

      originalQueueWorker(file, anyfetchClient, datas, function(err) {
        // Manually throw err (async.queue discards)
        if(err) {
          return done(err);
        }

        cb();
      });
    };
    var server = AnyFetchProvider.createServer(serverConfig);

    server.queue.drain = function() {
      done();
    };

    request(server)
      .post('/update')
      .send({
        access_token: 'fake_local_access_token',
        api_url: 'http://localhost:1338'
      })
      .expect(202)
      .end(function(err) {
        if(err) {
          throw err;
        }
      });
  });
});
