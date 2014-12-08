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

  var sum = holder.reduce(function(sum, item) {
    return sum + item;
  }, 0);

  console.log((sum / holder.length).toFixed(2));
}

module.exports.addition = function additionQueueWorker(job, cb) {
  console.log("UPLOADING", job.task.path);

  var document = {
    identifier: 'http://localprovider.local:' + job.anyfetchClient.accessToken + '/' + job.serviceData.path + job.task.path,
    actions: {},
    metadata: {
      path: job.task.path
    },
    document_type: "file",
    user_access: [job.anyfetchClient.accessToken]
  };

  var fileToSend = function(cb) {
    cb(null, {
      file: fs.createReadStream(job.serviceData.path + job.task.path),
      filename: job.task.path
    });
  };

  // Send document
  job.anyfetchClient.sendDocumentAndFile(document, fileToSend, function() {
    append(diff());
    cb();
  });
};
