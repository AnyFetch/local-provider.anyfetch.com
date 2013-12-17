'use strict';

var async = require('async');

var path = require("path");
var fs = require("fs");

var getFileFromPath = function(dir, cb) {
  var returnObject = {};
  var queue = async.queue(function(task, cb) {
    console.log('new task ', task);
    fs.readdir(task.dir, function(err, files) {
      if(err) {
        return cb(err);
      }

      async.map(files, function(values, cb) {
        var file = path.join(task.dir, values);
        // If the file is a directory we have to do the recursive
        fs.lstat(file, function(err, res) {
          if(res.isDirectory()) {
            queue.push({'dir' : file, 'base' : task.base + values + '/'});
            return cb(err);
          }
          else {
            fs.stat(file, function(err, stats) {
              returnObject[task.base + values] = stats.mtime;
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
    console.log('drain');
    cb(null, returnObject);
  };
};

module.exports = function(datas, cursor, next) {
  // Update documents from provider
  // You may define this as an helper function


  next(null, [], new Date());
};

module.exports.getFileFromPath = getFileFromPath;
