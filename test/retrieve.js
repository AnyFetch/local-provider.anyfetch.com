'use strict';

require('should');

var path = require("path");
var fs = require("fs");

var retrieveFile = require('../lib/provider-local/helpers/retrieve.js');

// Check datas are retrieved from filesystem
describe("getFileFromPath(path)", function () {
  it("should list the files inside the sample directory", function(done) {
    retrieveFile.getFileFromPath(path.resolve("test/sample"), function(err, res) {
      if(err) {
        throw err;
      }

      Object.keys(res).should.eql(['/txt1.txt', '/txt2.txt', '/txt3.txt', '/test/txt1.doc', '/test/txt2.txt']);
      done();
    });
  });
});


describe("Retrieve file", function () {
  it("should return the new file that are updated", function(done) {
    var cursor = {
      '/txt1.txt': fs.statSync(__dirname + '/sample/txt1.txt').mtime.getTime(),
      '/txt2.txt': fs.statSync(__dirname + '/sample/txt2.txt').mtime.getTime(),
      '/test/txt1.doc': fs.statSync(__dirname + '/sample/test/txt2.txt').mtime.getTime() - 500,
    };

    retrieveFile({'path' : path.resolve("test/sample")}, cursor, function(err, fileToUpload, newCursor) {
      if(err) {
        throw err;
      }

      // Should contain new files and updated files
      fileToUpload.should.eql(['/txt3.txt', '/test/txt1.doc', '/test/txt2.txt']);
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
