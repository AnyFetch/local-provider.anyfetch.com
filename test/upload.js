'use strict';

var request = require('supertest');
var AnyFetchProvider = require('anyfetch-provider');
var Anyfetch = require('anyfetch');
require('should');

var serverConfig = require('../lib/');

describe("Workflow", function() {
  before(AnyFetchProvider.debug.cleanTokens);

  // Create a fake HTTP server
  Anyfetch.setApiUrl('http://localhost:1337');
  var apiServer = Anyfetch.createMockServer();
  apiServer.listen(1337);

  before(function(done) {
    AnyFetchProvider.debug.createToken({
      anyfetchToken: 'fake_local_access_token',
      data: {path: __dirname + '/sample'},
      cursor: {},
      accountName: __dirname + '/sample'
    }, done);
  });

  it("should upload data to AnyFetch", function(done) {
    this.timeout(10000);

    var nbFiles = 0;

    serverConfig.config.retry = 0;
    var server = AnyFetchProvider.createServer(serverConfig.connectFunctions, __dirname + '/../lib/workers.js', __dirname + '/../lib/update.js', serverConfig.config);

    request(server)
      .post('/update')
      .send({
        access_token: 'fake_local_access_token',
        api_url: 'http://localhost:1337',
        documents_per_update: 2500
      })
      .expect(202)
      .end(function(err) {
        if(err) {
          throw err;
        }
      });

    server.usersQueue.on('job.task.completed', function() {
      nbFiles += 1;
    });

    server.usersQueue.on('job.task.failed', function(job, err) {
      done(err);
    });

    server.usersQueue.on('job.update.failed', function(job, err) {
      done(err);
    });

    server.usersQueue.once('empty', function() {
      nbFiles.should.eql(5);
      done();
    });
  });
});

