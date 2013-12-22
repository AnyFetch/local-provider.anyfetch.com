'use strict';

var fs = require("fs");

module.exports = function(file, cluestrClient, datas, next) {

  var document = {
    identifier: 'local.provider@' + cluestrClient.accessToken + file.path,
    actions: {
    },
    metadatas: {
      path: file.path
    },
    document_type: "file",
    user_access: [cluestrClient.accessToken]
  };

  var fileToSend = {
    file: fs.createReadStream(datas.path + file.path),
    knownLength: fs.statSync(datas.path + file.path).size
  };

  // Send document
  cluestrClient.sendDocumentAndFile(document, fileToSend, next);
};
