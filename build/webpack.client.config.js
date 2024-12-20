const webpack            = require('webpack')
const { merge }          = require('webpack-merge')
const base               = require('./webpack.base.config')
const {GenerateSW}       = require('workbox-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const VueLoaderPlugin    = require('vue-loader/lib/plugin')

const config = merge(base, {
  entry: {
    app: './src/entry-client.js'
  },
  resolve: {
    alias: {
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
    }),
      // strip dev-only code in Vue source
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    // extract vendor chunks for better caching
    new webpack.optimize.SplitChunksPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // a module is extracted into the vendor chunk if...
        return (
          // it's inside node_modules
          /node_modules/.test(module.context) &&
          // and not a CSS file (due to extract-text-webpack-plugin limitation)
          !/\.css$/.test(module.request)
        )
      }
    }),
    // extract webpack runtime & manifest to avoid vendor chunk hash changing
    // on every build.
    new webpack.optimize.SplitChunksPlugin({
      name: 'manifest'
    }),
    new VueSSRClientPlugin(),
    new VueLoaderPlugin()
  ]
})

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        // auto generate service worker
        new GenerateSW({
            cacheId: 'WebDollar-PWA',
            swDest: 'service-worker.js',
            dontCacheBustURLsMatching: /./,
            ignoreURLParametersMatching: [/\.map$/, /\.json$/],
            runtimeCaching: [
                {
                    urlPattern: '/',
                    handler: 'NetworkFirst'
                },
                {
                    urlPattern: /\/(top|new|show|ask|jobs)/,
                    handler: 'NetworkFirst'
                },
                {
                    urlPattern: '/item/:id',
                    handler: 'NetworkFirst'
                },
                {
                    urlPattern: '/user/:id',
                    handler: 'NetworkFirst'
                }
            ]
        })
    )
}

module.exports = config
