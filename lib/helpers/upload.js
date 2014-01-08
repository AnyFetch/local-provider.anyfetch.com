'use strict';

var fs = require("fs");

module.exports = function(file, cluestrClient, datas, next) {
  var document = {
    identifier: 'http://localprovider.local:' + cluestrClient.accessToken + '/' + datas.path + file.path,
    actions: {
    },
    metadatas: {
      path: file.path
    },
    document_type: "file",
    user_access: [cluestrClient.accessToken]
  };

  var fileToSend = function() {
    return {
      file: fs.createReadStream(datas.path + file.path),
    };
  };

  // Send document
  cluestrClient.sendDocumentAndFile(document, fileToSend, next);
};
