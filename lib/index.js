'use strict';
/**
 * This object contains all the handlers to use for this provider
 */

var fs = require('fs');
var async = require('async');

var config = require('../config/configuration.js');

var redirectToService = function(callbackUrl, cb) {
  cb(null, '/init/options?callback=' + encodeURIComponent(callbackUrl));
};

var retrieveTokens = function(reqParams, storedParams, cb) {
  if(!reqParams.path) {
    return cb(new Error("Missing path parameter"));
  }

  async.series([
    function(cb) {
      fs.exists(reqParams.path, function(exists) {
        if(!exists) {
          return cb("This directory does not exist: " + reqParams.path);
        }
        cb();
      });
    },
    function(cb) {
      fs.lstat(reqParams.path, function(err, stats) {
        if(err) {
          return cb(err);
        }

        if(!stats.isDirectory()) {
          return cb("This path is not a directory: " + reqParams.path);
        }

        cb();
      });
    }
  ], function(err) {
    if(err) {
      return cb(new Error(err));
    }

    // Store new data
    var data = {path: reqParams.path};
    cb(null, reqParams.path, data);
  });
};

module.exports = {
  connectFunctions: {
    redirectToService: redirectToService,
    retrieveTokens: retrieveTokens
  },

  config: config
};
