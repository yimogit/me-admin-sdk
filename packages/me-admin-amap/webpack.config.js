var path = require('path')
var webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const nodeEnv = process.env.NODE_ENV
const version = JSON.stringify(require('./package.json').version)
module.exports = {
  entry: nodeEnv === 'production' ? './src/index.js' : './example/vue/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: nodeEnv === 'production' ? 'me-admin-amap.js' : 'build.js',
    // filename: process.env.NODE_ENV === 'production'?'me-admin-amap.js':'build.js',
    library: 'MeAdminAmap',
    library: {
      root: 'MeAdminAmap',
      amd: 'me-admin-amap',
      commonjs: 'me-admin-amap'
    }, // 指定的就是你使用require时的模块名
    libraryTarget: 'umd', // 指定输出格式
    umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
  },
  externals: {
    vue: {
      root: 'Vue',
      commonjs2: 'vue',
      amd: 'vue',
      commonjs: 'vue'
    },
    'element-ui': {
      root: 'ELEMENT',
      commonjs2: 'element-ui',
      amd: 'element-ui',
      commonjs: 'element-ui'
    }
  },
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
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        VERSION: version
      }
    })
  ]
}
console.log({
  nodeEnv: nodeEnv,
  version: version
})
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
        NODE_ENV: '"' + process.env.NODE_ENV + '"',
        VERSION: version
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new CopyWebpackPlugin([
      {
        from: 'node_modules/vue/dist/vue.min.js',
        to: 'libs/vue/index.js'
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
      }
    ])
  ])
}
