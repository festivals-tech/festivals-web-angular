var gzippo = require('gzippo');
var express = require('express');
var app = express();

var options = {
  maxAge : 86400000,
  clientMaxAge : 604800000
};

app.use(gzippo.staticGzip("" + __dirname + "/dist", options));
app.listen(process.env.PORT || 5000);