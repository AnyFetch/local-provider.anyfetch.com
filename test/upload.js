'use strict';

var request = require('supertest');
var CluestrProvider = require('cluestr-provider');
require('should');

var serverConfig = require('../lib/provider-local');


describe("Workflow", function () {
// Create a fake HTTP server
  process.env.CLUESTR_SERVER = 'http://localhost:1337';
  var frontServer = CluestrProvider.debug.createTestApiServer();
  frontServer.listen(1337);

  before(CluestrProvider.debug.cleanTokens);
  before(function(done) {
    CluestrProvider.debug.createToken({
      cluestrToken: 'fake_local_access_token',
      datas: {path: __dirname + '/sample'},
      cursor: {}
    }, done);
  });

  it("should upload datas to Cluestr", function (done) {
    var originalQueueWorker = serverConfig.queueWorker;
    serverConfig.queueWorker = function(file, cluestrClient, datas, cb) {
      file.should.have.property('path');

      originalQueueWorker(file, cluestrClient, datas, cb);
    };
    var server = CluestrProvider.createServer(serverConfig);

    server.queue.drain = function() {
      done();
    };

    request(server)
      .post('/update')
      .send({
        access_token: 'fake_local_access_token'
      })
      .expect(202)
      .end(function(err) {
        if(err) {
          throw err;
        }
      });
  });
});
