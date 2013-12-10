'use strict';
/**
 * This object contains all the handlers to use for this provider
 */

var config = require('../../config/configuration.js');

var initAccount = function(req, next) {
  // Redirect user to provider consentment page
  next(null, {code: req.params.code}, 'http://PROVIDER.com');
};

var connectAccountRetrievePreDatasIdentifier = function(req, next) {
  // Retrieve identifier for current request
  next(null, {'datas.code': req.params.state});
};

var connectAccountRetrieveAuthDatas = function(req, preDatas, next) {
  // Store new datas
  next(null, "some-datas");
};

var updateAccount = function(refreshToken, cursor, next) {
  // Update documents from provider
  // You may define this as an helper function
  next(null, [], new Date());
};

var queueWorker = function(mail, CluestrClient, cb) {
  // Send datas to Cluestr.
  // You may define this as an helper function
  cb();
};

module.exports = {
  initAccount: initAccount,
  connectAccountRetrievePreDatasIdentifier: connectAccountRetrievePreDatasIdentifier,
  connectAccountRetrieveAuthDatas: connectAccountRetrieveAuthDatas,
  updateAccount: updateAccount,
  queueWorker: queueWorker,

  cluestrAppId: config.cluestr_id,
  cluestrAppSecret: config.cluestr_secret,
  connectUrl: config.connect_url
};
