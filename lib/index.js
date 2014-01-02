'use strict';
/**
 * This object contains all the handlers to use for this provider
 */

var fs = require('fs');

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
  if(!fs.lstatSync(req.params.path).isDirectory()) {
    return next(new Error("This path is not a directory"));
  }
  if(fs.existsSync(req.params.path)) {
    return next(new Error("This directory does not exist."));
  }
  // Store new datas
  var datas = {'path' : req.params.path}
  next(null, datas);
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
