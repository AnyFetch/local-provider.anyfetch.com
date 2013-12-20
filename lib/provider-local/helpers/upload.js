'use strict';

var fs = require("fs");

module.exports = function(file, cluestrClient, next) {

  var document = {
    identifier: 'local.provider@' + cluestrClient.accessToken + file,
    actions: {
    },
    metadatas: {
      path: file
    },
    document_type: "file",
    user_access: [cluestrClient.accessToken]
  };

  // Send document
  cluestrClient.sendDocumentAndFile(document, {file: fs.createReadStream(file)}, next);
};
