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

var connectAccountRetrievePreDatasIdentifier = function(req, next) {
  // Retrieve identifier for current request
  next(null, {'datas.code': req.params.code});
};

var connectAccountRetrieveAuthDatas = function(req, preDatas, next) {
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

    // Store new datas
    var datas = {'path' : req.params.path}
    next(null, datas);
  });
};


var queueWorker = function(task, CluestrClient, next) {
  // Send datas to Cluestr.
  // You may define this as an helper function
  next();
};

module.exports = {
  initAccount: initAccount,
  connectAccountRetrievePreDatasIdentifier: connectAccountRetrievePreDatasIdentifier,
  connectAccountRetrieveAuthDatas: connectAccountRetrieveAuthDatas,
  updateAccount: retrieveFile,
  queueWorker: uploadFile,

  cluestrAppId: config.cluestr_id,
  cluestrAppSecret: config.cluestr_secret,
  connectUrl: config.connect_url
};
