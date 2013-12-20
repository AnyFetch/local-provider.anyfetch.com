'use strict';

require('should');

var path = require("path");

var config = require('../config/configuration.js');

var retrieveFile = require('../lib/provider-local/helpers/retrieve.js')
// Check datas are retrieved from PROVIDER

describe("getFileFromPath(path)", function () {
  it("should list the file inside the sample directory", function(done) {
    retrieveFile.getFileFromPath(path.resolve("test/sample"), function(err, res) {
      if(err) {
        throw err;
      }
      var test = true;
      if(Object.keys(res).length != 5)
        test = false;
      if( !("/txt1.txt" in res) ||
          !("/txt2.txt" in res) ||
          !("/txt3.txt" in res) ||
          !("/test/txt1.doc" in res) ||
          !("/test/txt2.txt" in res) ) {
        test = false;
      }
      if(!test) {
        throw new Error("The result didn't contain the good value.");
      }
      done();
    });
  });
});


describe("retrieve file", function () {
  it("should return the new file that are updated", function(done) {
    var cursor = {
      '/txt2.txt': 1387277853000, //Same
      '/txt3.txt': 1387277863000, //Same
      '/test/txt1.doc': 1387277000000, //Older
      //'/txt1.txt': 1387277838000,
      //'/test/txt2.txt': 1387277912000 //Doesnt exist
    }
    retrieveFile({'path' : path.resolve("test/sample")}, cursor, function(err, fileToUpload, newCursor) {
      if(err) {
        throw err;
      }

      fileToUpload.should.eql(['/txt1.txt', '/test/txt1.doc', '/test/txt2.txt']);
      newCursor.should.eql({  '/txt1.txt': 1387277838000,
                              '/txt2.txt': 1387277853000,
                              '/txt3.txt': 1387277863000,
                              '/test/txt1.doc': 1387277898000,
                              '/test/txt2.txt': 1387277912000 }
      );

      done();
    });
  });
});