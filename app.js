"use strict";

// Load configuration and initialize server
var anyfetchProvider = require('anyfetch-provider');
var serverConfig = require('./lib/');
var fs = require('fs');

var server = anyfetchProvider.createServer(serverConfig.connectFunctions, __dirname + '/lib/workers.js', __dirname + '/lib/update.js', serverConfig.config);

// Root the init/options page to configure the directory of this specific provider
server.get('/init/options', function(req, res, next) {
  fs.readFile('./templates/option-form.html', 'utf8', function read(err, data) {
    if(err) {
      return next(err);
    }
    var content = data.replace(/%callback%/, req.params.callback);

    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(content),
      'Content-Type': 'text/html'
    });

    res.write(content);
    res.end();

    next();
  });
});

// Expose the server
module.exports = server;
