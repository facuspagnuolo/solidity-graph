const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const config = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, "/dist"),
    compress: true,
    port: 3000,
    host: "0.0.0.0",
    historyApiFallback: {
      index: './index.html'
    }
  },
  watchOptions: {
    poll: 1000
  },
});

module.exports = config;
