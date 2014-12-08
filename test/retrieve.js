'use strict';

require('should');

var path = require("path");
var fs = require("fs");

var getFileFromPath = require('../lib/update.js').getFileFromPath;
var update = require('../lib/update.js');

// Check data are retrieved from filesystem
describe("getFileFromPath(path)", function() {
  it("should list the files inside the sample directory", function(done) {
    getFileFromPath(path.resolve("test/sample"), function(err, res) {
      if(err) {
        throw err;
      }

      Object.keys(res).should.containEql('/txt1.txt');
      Object.keys(res).should.containEql('/txt2.txt');
      Object.keys(res).should.containEql('/txt3.txt');
      Object.keys(res).should.containEql('/test/txt1.doc');
      Object.keys(res).should.containEql('/test/txt2.txt');
      Object.keys(res).should.have.lengthOf(5);
      done();
    });
  });
});


describe("Retrieve file", function() {
  it("should return the new file that are updated", function(done) {
    var queues = {
      addition: []
    };

    var cursor = JSON.stringify({
      '/txt1.txt': fs.statSync(__dirname + '/sample/txt1.txt').mtime.getTime(),
      '/txt2.txt': fs.statSync(__dirname + '/sample/txt2.txt').mtime.getTime(),
      '/test/txt1.doc': fs.statSync(__dirname + '/sample/test/txt1.doc').mtime.getTime() - 500,
    });

    update({path: path.resolve("test/sample")}, cursor, queues, function(err, newCursor) {
      if(err) {
        return done(err);
      }

      newCursor = JSON.parse(newCursor);

      queues.addition.should.eql([
        {path: '/txt3.txt'},
        {path: '/test/txt1.doc'},
        {path: '/test/txt2.txt'}
      ]);

      newCursor.should.eql({
        '/txt1.txt': fs.statSync(__dirname + '/sample/txt1.txt').mtime.getTime(),
        '/txt2.txt': fs.statSync(__dirname + '/sample/txt2.txt').mtime.getTime(),
        '/txt3.txt': fs.statSync(__dirname + '/sample/txt3.txt').mtime.getTime(),
        '/test/txt1.doc': fs.statSync(__dirname + '/sample/test/txt1.doc').mtime.getTime(),
        '/test/txt2.txt': fs.statSync(__dirname + '/sample/test/txt2.txt').mtime.getTime()
      });

      done();
    });
  });
});
