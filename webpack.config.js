var webpack = require('webpack');

module.exports = {
  plugins: [],
  entry: './lib/tonic-data-manager.js',
  output: {
    path: './dist',
    filename: 'tonic-data-manager.js',   
  },
  module: {
    preLoaders: [
      {
          test: /\.js$/, 
          exclude: /node_modules/,
          loader: "jshint-loader"
      }
    ],
    loaders: [
        { 
          test: require.resolve("./lib/tonic-data-manager.js"), 
          loader: "expose?tonicDataManager"
        },{
          test: /\.js$/i,
          loader: "strict-loader"
        }
    ]
  },
  externals: {
  }
};
