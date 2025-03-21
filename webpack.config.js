var webpack = require('webpack'),
  path = require('path'),
  fileSystem = require('fs-extra'),
  env = require('./utils/env'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  TerserPlugin = require('terser-webpack-plugin')
var { CleanWebpackPlugin } = require('clean-webpack-plugin')
var ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
var ReactRefreshTypeScript = require('react-refresh-typescript')

const ASSET_PATH = process.env.ASSET_PATH || '/'

var alias = {}

// load the secrets
var secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js')

var fileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2']

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath
}

const isDevelopment = process.env.NODE_ENV !== 'production'

var options = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    // newtab: path.join(__dirname, 'src', 'pages', 'Newtab', 'index.jsx'),
    // options: path.join(__dirname, 'src', 'pages', 'Options', 'index.jsx'),
    popup: path.join(__dirname, 'src', 'pages', 'Popup', 'index.jsx'),
    background: path.join(__dirname, 'src', 'pages', 'Background', 'index.js')
    // contentScript: path.join(__dirname, 'src', 'pages', 'Content', 'index.js'),
    // devtools: path.join(__dirname, 'src', 'pages', 'Devtools', 'index.js'),
    // panel: path.join(__dirname, 'src', 'pages', 'Panel', 'index.jsx')
  },
  chromeExtensionBoilerplate: {
    notHotReload: ['background', 'contentScript', 'devtools']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
    publicPath: ASSET_PATH
  },
  module: {
    rules: [
      {
        // look for .css or .scss files
        test: /\.(css|scss)$/,
        // in the `src` directory
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        type: 'asset/resource',
        exclude: /node_modules/
        // loader: 'file-loader',
        // options: {
        //   name: '[name].[ext]',
        // },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              getCustomTransformers: () => ({
                before: [isDevelopment && ReactRefreshTypeScript()].filter(Boolean)
              }),
              transpileOnly: isDevelopment
            }
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'source-map-loader'
          },
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean)
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]'
        }
      }
    ]
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions.map((extension) => '.' + extension).concat(['.js', '.jsx', '.ts', '.tsx', '.css'])
  },
  plugins: [
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new CleanWebpackPlugin({ verbose: false }),
    new webpack.ProgressPlugin(),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: path.join(__dirname, 'build'),
          force: true,
          transform: function (content, path) {
            // generates the manifest file using the package.json informations
            return Buffer.from(
              JSON.stringify({
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                ...JSON.parse(content.toString())
              })
            )
          }
        }
      ]
    }),
    // Comment out unused content styles copy
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: 'src/pages/Content/content.styles.css',
    //       to: path.join(__dirname, 'build'),
    //       force: true
    //     }
    //   ]
    // }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/img/icon-128.png',
          to: path.join(__dirname, 'build'),
          force: true
        }
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/img/icon-34.png',
          to: path.join(__dirname, 'build'),
          force: true
        },
        {
          from: 'src/assets/img',
          to: path.join(__dirname, 'build/assets/img'),
          force: true
        }
      ]
    }),
    // Comment out unused HTML plugins
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, 'src', 'pages', 'Newtab', 'index.html'),
    //   filename: 'newtab.html',
    //   chunks: ['newtab'],
    //   cache: false
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, 'src', 'pages', 'Options', 'index.html'),
    //   filename: 'options.html',
    //   chunks: ['options'],
    //   cache: false
    // }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Popup', 'index.html'),
      filename: 'popup.html',
      chunks: ['popup'],
      cache: false
    })
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, 'src', 'pages', 'Devtools', 'index.html'),
    //   filename: 'devtools.html',
    //   chunks: ['devtools'],
    //   cache: false
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, 'src', 'pages', 'Panel', 'index.html'),
    //   filename: 'panel.html',
    //   chunks: ['panel'],
    //   cache: false
    // })
  ].filter(Boolean),
  infrastructureLogging: {
    level: 'info'
  }
}

if (env.NODE_ENV === 'development') {
  options.devtool = 'cheap-module-source-map'
} else {
  options.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: {
          format: {
            comments: false
          },
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: [
              'console.log',
              'console.info',
              'console.debug',
              'console.warn',
              'console.error',
              'console.trace',
              'console.table'
            ]
          },
          mangle: true
        }
      })
    ]
  }
}

module.exports = options
