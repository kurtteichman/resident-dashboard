var express = require('express');
var server = express();
var sys = require('sys');
var http = require('http');
var fs = require('fs');

server.configure(function() {
  server.use(express.logger());
  server.use(express.compress());
  server.use(express.static(__dirname + '/src'), { maxAge: 86400000 });
  server.use(express.bodyParser());
});

server.listen(7998);
