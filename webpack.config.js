var path = require('path')
var webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const nodeEnv = process.env.NODE_ENV
const isMini = process.env.PACKAGE_MINI === 'true'
module.exports = {
  entry: nodeEnv === 'production' ? './src/index.js' : './example/dev/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename:
      nodeEnv === 'production'
        ? isMini
          ? 'me-admin-sdk.js'
          : 'me-admin-sdk-full.js'
        : 'build.js',
    library: {
      root: 'MeAdminSdk',
      amd: 'me-admin-sdk',
      commonjs: 'me-admin-sdk'
    }, // 指定的就是你使用require时的模块名
    libraryTarget: 'umd', // 指定输出格式
    umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
  },
  externals: isMini
    ? {
        vue: {
          root: 'Vue',
          commonjs2: 'vue',
          amd: 'vue',
          commonjs: 'vue'
        },
        vuex: {
          root: 'Vuex',
          commonjs2: 'vuex',
          amd: 'vuex',
          commonjs: 'vuex'
        },
        axios: 'axios',
        nprogress: {
          root: 'NProgress',
          commonjs2: 'nprogress',
          amd: 'nprogress',
          commonjs: 'nprogress'
        },
        'vue-router': {
          root: 'VueRouter',
          commonjs2: 'vue-router',
          amd: 'vue-router',
          commonjs: 'vue-router'
        },
        'element-ui': {
          root: 'ELEMENT',
          commonjs2: 'element-ui',
          amd: 'element-ui',
          commonjs: 'element-ui'
        }
      }
    : {},
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {}
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(svg|woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          name: 'fonts/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.less$/,
        use: ['vue-style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              indentedSyntax: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    proxy: {
      '/mockserver': {
        target: 'http://192.168.1.32:2233',
        changeOrigin: true,
        pathRewrite: {
          '^/mockserver': ''
        }
      }
    },
    host: 'localhost',
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [new VueLoaderPlugin()]
}
console.log({ nodeEnv: nodeEnv, isMini: isMini })
if (nodeEnv === 'production') {
  const Terser = require('terser')
  const Postcss = require('postcss')
  const Cssnano = require('cssnano')
  module.exports.optimization = {
    namedModules: true,
    namedChunks: true,
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: false,
        uglifyOptions: {
          extractComments: true,
          output: {
            comments: false
          },
          cache: true,
          parallel: true
        }
      })
    ]
  }
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"' + process.env.NODE_ENV + '"'
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new CopyWebpackPlugin(
      isMini
        ? [
            {
              from: 'node_modules/vue/dist/vue.min.js',
              to: 'libs/vue/index.js'
            },
            {
              from: 'node_modules/vue-router/dist/vue-router.min.js',
              to: 'libs/vue-router/index.js'
            },
            {
              from: 'node_modules/vuex/dist/vuex.min.js',
              to: 'libs/vuex/index.js'
            },
            {
              from: 'node_modules/axios/dist/axios.min.js',
              to: 'libs/axios/index.js'
            },
            {
              from: 'node_modules/element-ui/lib/theme-chalk/index.css',
              to: 'libs/element-ui/index.css'
            },
            {
              from: 'node_modules/element-ui/lib/theme-chalk/fonts/',
              to: 'libs/element-ui/fonts/'
            },
            {
              from: 'node_modules/element-ui/lib/index.js',
              to: 'libs/element-ui/index.js'
            },
            {
              from: 'node_modules/nprogress/nprogress.css',
              to: 'libs/nprogress/index.css',
              transform: function(content, path) {
                return Postcss([Cssnano])
                  .process(content)
                  .then(r => {
                    return Promise.resolve(r.css)
                  })
              }
            },
            {
              from: 'node_modules/nprogress/nprogress.js',
              to: 'libs/nprogress/index.js',
              transform: function(content, path) {
                return Terser.minify(content.toString()).code
              }
            }
          ]
        : [
            {
              from: 'node_modules/element-ui/lib/theme-chalk/index.css',
              to: 'libs/element-ui/index.css'
            },
            {
              from: 'node_modules/element-ui/lib/theme-chalk/fonts/',
              to: 'libs/element-ui/fonts/'
            },
            {
              from: 'node_modules/nprogress/nprogress.css',
              to: 'libs/nprogress/index.css',
              transform: function(content, path) {
                return Postcss([Cssnano])
                  .process(content)
                  .then(r => {
                    return Promise.resolve(r.css)
                  })
              }
            }
          ]
    )
  ])
}
