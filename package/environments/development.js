const Environment = require('../environment')
const { dev_server } = require('../config')
const assetHost = require('../asset_host')
const webpack = require('webpack')

module.exports = class extends Environment {
  constructor() {
    super()

    if (dev_server.hmr) {
      this.plugins.set('HotModuleReplacement', new webpack.HotModuleReplacementPlugin())
      this.plugins.set('NamedModules', new webpack.NamedModulesPlugin())
    }
  }

  toWebpackConfig() {
    const result = super.toWebpackConfig()
    if (dev_server.hmr) {
      result.output.filename = '[name]-[hash].js'
    }
    result.output.pathinfo = true
    result.devtool = 'cheap-eval-source-map'
    result.devServer = {
      clientLogLevel: 'none',
      compress: true,
      disableHostCheck: dev_server.disable_host_check,
      host: dev_server.host,
      port: dev_server.port,
      https: dev_server.https,
      hot: dev_server.hmr,
      contentBase: assetHost.path,
      inline: dev_server.inline,
      useLocalIp: dev_server.use_local_ip,
      public: dev_server.public,
      publicPath: assetHost.publicPath,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      overlay: true,
      watchOptions: {
        ignored: /node_modules/
      },
      stats: {
        errorDetails: true
      }
    }
    return result
  }
}
