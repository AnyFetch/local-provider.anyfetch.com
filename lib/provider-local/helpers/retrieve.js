'use strict';

var async = require('async');

var path = require("path");
var fs = require("fs");

var getFileFromPath = function(dir, cb) {
  var returnObject = {};
  var queue = async.queue(function(task, callback) {

    console.log('new task ', task);
    fs.readdir(task.dir, function(err, files) {
      files.forEach(function(values) {
        var file = path.join(task.dir, values);
        //If the file is a directory we have to do the recursive
        if(fs.lstatSync(file).isDirectory()) {
          queue.push({'dir' : file, 'base' : task.base + values + '/'});
        }
        //if not
        else {
          fs.stat(file, function(err, stats){
            console.log(task.base + values);
            returnObject[task.base + values] = stats.mtime;
          });
        }
      });
    });
  });

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
