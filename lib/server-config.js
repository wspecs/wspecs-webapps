let config = require('./config');
let args = require('./args');

config.isProd = (args.get('instance') == 'prod');
config.isDev = !config.isProd;

if (config.isProd) {
  config.base = `${config.prod.url}${config.path}/`;
}
else {
  config.port += 1;
  config.base = `${config.dev.url}:${config.port}${config.path}/`;
}
args.reload();

module.exports = Object.assign(config, args.options);
