'use strict';

var async = require('async');

var path = require("path");
var fs = require("fs");

var getFileFromPath = function(dir, cb) {
  var returnObject = {};
  var queue = async.queue(function(task, cb) {
    fs.readdir(task.dir, function(err, files) {
      if(err) {
        return cb(err);
      }

      async.map(files, function(nameOfFile, cb) {
        var file = path.join(task.dir, nameOfFile);
        // If the file is a directory we have to do the recursive
        fs.lstat(file, function(err, res) {
          if(res.isDirectory()) {
            queue.push({'dir' : file, 'base' : task.base + nameOfFile + '/'});
            return cb(err);
          }
          else {
            fs.stat(file, function(err, stats) {
              returnObject[task.base + nameOfFile] = stats.mtime.getTime();
              return cb(err);
            });
          }
        });
      }, cb);
    });
  }, 3);

  // Push first item to start pseudo-recursion
  queue.push({'dir' : dir, 'base' : '/'});

  queue.drain = function() {
    cb(null, returnObject);
  };
};

module.exports = function(datas, cursor, next) {
  // Update documents from provider
  // Compare cursor and the file on the disk
  // If the files has been updated we add the file in the files to upload
  var fileToUpload = [];
  var newCursor = {};
  var queue = async.queue(function(task, cb) {
    getFileFromPath(task.path, function(err, filesOnDisk) {
      newCursor = filesOnDisk;
      for (var key in filesOnDisk) {
        if(key in cursor) {
          if(cursor[key] < filesOnDisk[key]) {
            fileToUpload.push(key);
          }
        }
        else {
          fileToUpload.push(key);
        }
      }
      cb();
    });
  });

  queue.push({'path' : datas.path});

  queue.drain = function() {
    next(null, fileToUpload, newCursor);
  }
};

module.exports.getFileFromPath = getFileFromPath;
