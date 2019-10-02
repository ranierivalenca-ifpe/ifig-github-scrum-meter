const path = require('path');

module.exports = {
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js']
  },
  // module: {
  //   rules: [
  //     { test: /\.js$/, use: 'js-loader' }
  //   ]
  // }
};