'use strict';
/**
 * This object contains all the handlers to use for this provider
 */

var fs = require('fs');
var async = require('async');

var config = require('../config/configuration.js');



var retrieveFile = require('./helpers/retrieve.js');
var uploadFile = require('./helpers/upload.js');

var initAccount = function(req, next) {
  // Redirect user to provider consentment page
  next(null, {code: req.params.code}, '/init/options?code=' + req.params.code);
};

var connectAccountRetrievePreDataIdentifier = function(req, next) {
  // Retrieve identifier for current request
  next(null, {'data.code': req.params.code});
};

var connectAccountRetrieveAuthData = function(req, preData, next) {
  if(!req.params.path) {
    return next(new Error("Missing path parameter"));
  }

  async.series([
    function(cb) {
      fs.exists(req.params.path, function(exists) {
        if(!exists) {
          return cb("This directory does not exist: " + req.params.path);
        }
        cb();
      });
    },
    function(cb) {
      fs.lstat(req.params.path, function(err, stats) {
        if(err) {
          return cb(err);
        }

        if(!stats.isDirectory()) {
          return cb("This path is not a directory: " + req.params.path);
        }

        cb();
      });
    }
  ], function(err) {
    if(err) {
      return next(new Error(err));
    }

    // Store new data
    var data = {'path' : req.params.path};
    next(null, data);
  });
};


module.exports = {
  initAccount: initAccount,
  connectAccountRetrievePreDataIdentifier: connectAccountRetrievePreDataIdentifier,
  connectAccountRetrieveAuthData: connectAccountRetrieveAuthData,
  updateAccount: retrieveFile,
  queueWorker: uploadFile,

  anyfetchAppId: config.anyfetch_id,
  anyfetchAppSecret: config.anyfetch_secret,
  connectUrl: config.connect_url
};
