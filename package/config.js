const NODE_ENV = process.env.NODE_ENV || 'development'
const WEBPACKER_ENV_REGEX = /^WEBPACKER_/i

const { resolve } = require('path')
const { safeLoad } = require('js-yaml')
const { existsSync, readFileSync } = require('fs')
const dotEnv = require('dotenv')

const filePath = resolve('config', 'webpacker.yml')
const config = safeLoad(readFileSync(filePath), 'utf8')[NODE_ENV]

const isBoolean = str => /^true/.test(str) || /^false/.test(str)

const fetch = key =>
  process.env[`WEBPACKER_DEV_SERVER_${key.toUpperCase().replace('_', '')}`] || config.dev_server[key]

const devServer = key =>
  (isBoolean(fetch(key)) ? JSON.parse(fetch(key)) : fetch(key))

const envFiles = [
  `env.${NODE_ENV}.local`,
  `env.${NODE_ENV}`,
  NODE_ENV !== 'test' && 'env.local',
  '.env'
].filter(Boolean)

envFiles.forEach((envFile) => {
  const envFilePath = resolve(process.cwd(), envFile)

  if (existsSync(envFilePath)) {
    dotEnv.config({
      path: envFilePath
    })
  }
})

config.env = Object.keys(process.env)
  .filter(key => WEBPACKER_ENV_REGEX.test(key))
  .reduce((env, key) => {
    /* eslint no-param-reassign: 0 */
    env[key] = process.env[key]
    return env
  }, {
    NODE_ENV
  }
)

if (config.dev_server) {
  Object.keys(config.dev_server).forEach(key => (config.dev_server[key] = devServer(key)))
}

module.exports = config
