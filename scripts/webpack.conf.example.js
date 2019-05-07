const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintFormatter = require('eslint-friendly-formatter')
const webpack = require('webpack')
const path = require('path')
const os = require('os')

// const { sourceMap, esLint, basePath, srcDir, outDir, vendor } = require('./project.config')

const esLint = true
const basePath = path.resolve(__dirname, '../')
const srcDir = path.resolve(__dirname, '../example')
const outDir = path.resolve(__dirname, '../example/dist')
const publicPath = './'

const isProduction = process.env.NODE_ENV == 'production'

const ESLintRule = () => ({
  test: /\.jsx?$/,
  use: {
    loader: 'eslint-loader?cacheDirectory',
    options: {
      formatter: ESLintFormatter
    }
  },
  enforce: 'pre',
  include: srcDir,
  exclude: /node_modules/
})

/* eslint-disable */
function resolve(dir) {
  return path.resolve(__dirname, '..', dir)
}
/* eslint-enable */

const webpackConfig = {
  context: basePath, // entry 和 module.rules.loader 选项相对于此目录开始解析
  mode: isProduction ? 'production' : 'development',
  cache: {
    type: 'filesystem'
  },
  entry: {
    entry: [path.resolve(srcDir, 'index.js')]
  },
  output: {
    path: outDir, // 将打包好的文件放在此路径下，dev模式中，只会在内存中存在，不会真正的打包到此路径
    filename: '[name].[hash].js',
    publicPath: '/' // 文件解析路径，index.html中引用的路径会被设置为相对于此路径
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [srcDir, 'node_modules'], // 指定以下目录寻找第三方模块，避免webpack往父级目录递归搜索
    // mainFields: ['main'], // 只采用main字段作为入口文件描述字段，减少搜索步骤
    alias: {
      // '@': srcDir // 缓存src目录为@符号，避免重复寻址
    }
  },
  // resolveLoader: {},
  module: {
    // noParse: /jquery|lodash/, // 忽略未采用模块化的文件，因此jquery或lodash将不会被下面的loaders解析
    rules: [
      ...(esLint ? [ESLintRule()] : []),

      {
        test: /\.jsx?$/,
        // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
        include: [
          srcDir,
          path.resolve(__dirname, '../src'),
          path.resolve(__dirname, '../dist'),
          path.resolve(__dirname, '../node_modules/axios')
        ],
        // exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // Required
      inject: true, // 是否将js放在body的末尾
      hash: false, // 防止缓存，在引入的文件后面加hash (PWA就是要缓存，这里设置为false)
      // template: require('html-webpack-template'),
      // template: 'node_modules/html-webpack-template/index.ejs',
      template: path.join(basePath, 'example/index.html'),
      filename: 'index.html', // 生成的html存放路径，相对于 output.path

      // Optional
      appMountId: 'app',
      // title: 'React App',
      // favicon: path.join(basePath, 'public/favicon.png'),
      // mobile: true,
      lang: 'en-US',
      // inlineManifestWebpackName: 'webpackManifest',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
        useShortDoctype: true,
        html5: true
      },
      chunksSortMode: 'dependency'
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  devtool: 'cheap-module-eval-source-map', // 报错的时候在控制台输出哪一行报错

  watchOptions: {
    ignored: [/node_modules/, '/dist/', '/example/dist/', '/dll/'], // 不监听目录
    aggregateTimeout: 300, // 防止重复保存频繁重新编译,300ms内重复保存不打包
    poll: 1000 // 每秒询问的文件变更的次数
  },
  devServer: {
    contentBase: outDir,
    compress: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    },
    open: false,
    overlay: {
      warnings: true,
      errors: true
    },
    port: 8080,
    publicPath: 'http://localhost:8080/',
    hot: true,
    inline: true,
    noInfo: true
  },
  stats: {
    children: false
  },
  performance: false
}

module.exports = webpackConfig
