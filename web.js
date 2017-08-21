var express = require('express')
var app = express()
var routes = require('./routes')
var log = require('./lib/log')
var restConfig = require('./lib/rest-config')
var serverConfig = require('./lib/server-config')

app.serve = function(res, name, option) {
  return res.render(name, Object.assign(serverConfig, (options || {})));
}
restConfig(app, express);
routes(app);

app.listen(serverConfig.port, function () {
  log.info('port: %s', serverConfig.port);
  log.info('url: %s', serverConfig.base);
});
