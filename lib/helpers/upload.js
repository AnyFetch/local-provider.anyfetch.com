'use strict';

var fs = require("fs");

var oldDate;

function diff() {
  if(!oldDate) {
    oldDate = new Date().getTime();
  }
  var timediff = new Date().getTime() - oldDate;
  oldDate = new Date().getTime();
  return timediff;
}

var holder = [];

function append(newTime) {
  holder.push(newTime);

  if(holder.length > 20) {
    holder.shift();
  }

  var sum = holder.reduce(function(sum, item) { return sum + item;}, 0);
  console.log((sum / holder.length).toFixed(2));
}

module.exports = function(file, anyfetchClient, data, next) {
  console.log("UPPING", file.path);

  var document = {
    identifier: 'http://localprovider.local:' + anyfetchClient.accessToken + '/' + data.path + file.path,
    actions: {
    },
    metadata: {
      path: file.path
    },
    document_type: "file",
    user_access: [anyfetchClient.accessToken]
  };

  var fileToSend = function() {
    return {
      file: fs.createReadStream(data.path + file.path),
    };
  };

  // Send document
  anyfetchClient.sendDocumentAndFile(document, fileToSend, function() {
    append(diff());
    next();
  });
};
