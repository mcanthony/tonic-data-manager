var webpack = require('webpack');

module.exports = {
  plugins: [],
  entry: './lib/TonicDataManager.js',
  output: {
    path: './dist',
    filename: 'TonicDataManager.js',
  },
  module: {
    preLoaders: [
      {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "jshint-loader!babel"
      }
    ],
    loaders: [
        {
          test: require.resolve("./lib/TonicDataManager.js"),
          loader: "expose?TonicDataManager"
        }
    ]
  },
  jshint: {
    esnext: true,
    browser: true,
    globalstrict: true // Babel add 'use strict'
  },
  externals: {
  }
};
