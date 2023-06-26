const dotenv = require('dotenv').config()
const path = require('path');
const webpack = require('webpack')

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    main: './src/index.js',
    login: './src/login.js',
    register: './src/register.js',
    firebaseConfig: './src/firebaseConfig.js',
    financialChart: './src/financialChart.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'www/dist/js')
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'www/dist/js'),
    port: 8080
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed)
    }),
    new Dotenv()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
