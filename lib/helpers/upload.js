'use strict';

var fs = require("fs");

var oldDate = new Date().getTime();

function diff(){
  var timediff = new Date().getTime() - oldDate;
  oldDate = new Date().getTime();
  return timediff;
}




module.exports = function(file, anyfetchClient, datas, next) {
  console.log("UPPING", file.path);

  var document = {
    identifier: 'http://localprovider.local:' + anyfetchClient.accessToken + '/' + datas.path + file.path,
    actions: {
    },
    metadatas: {
      path: file.path
    },
    document_type: "file",
    user_access: [anyfetchClient.accessToken]
  };

  var fileToSend = function() {
    return {
      file: fs.createReadStream(datas.path + file.path),
    };
  };

  // Send document
  anyfetchClient.sendDocumentAndFile(document, fileToSend, next);
  console.log(diff() + " ms");
};
