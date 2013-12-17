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
      console.log(res);
      done();
    });
  });
});