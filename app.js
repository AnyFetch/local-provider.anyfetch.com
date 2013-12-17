"use strict";

// Load configuration and initialize server
var CluestrProvider = require('cluestr-provider');
var serverConfig = require('./lib/provider-local');
var fs = require('fs');

var server = CluestrProvider.createServer(serverConfig);

//Root the init/options page to configure the directory of this specific provider
server.get('/init/options', function(req, res, next) {    
  fs.readFile('./templates/option-form.html', 'utf8',function read(err, data) {
    if (err) {
      return next(err);
    }
    var content = data.replace(/%code%/, req.params.code);

    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(content),
      'Content-Type': 'text/html'
    });

    res.write(content);
    res.end();

    next();
  });
})

// Expose the server
module.exports = server;
