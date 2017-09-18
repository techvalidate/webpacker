const { safeLoad } = require('js-yaml')
const { readFileSync } = require('fs')
const env = require('./env')
const paths = require('./paths')

const config = safeLoad(readFileSync(paths.config), 'utf8')[env.NODE_ENV]

const devServer = key =>
  env[`WEBPACKER_DEV_SERVER_${key.toUpperCase().replace('_', '')}`] || config.dev_server[key]

if (config.dev_server) {
  Object.keys(config.dev_server).forEach(key => (config.dev_server[key] = devServer(key)))
}

module.exports = config
