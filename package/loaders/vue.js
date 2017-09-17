const { dev_server: devServer, env } = require('../config')

const isProduction = env.NODE_ENV === 'production'
const extractCSS = !(devServer && devServer.hmr)

module.exports = {
  test: /\.vue(\.erb)?$/,
  loader: 'vue-loader',
  options: {
    extractCSS: isProduction || extractCSS
  }
}
