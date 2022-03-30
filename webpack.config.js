const path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    index: './index.js',
    admin0: './admin0.js',
    admin1: './admin1.js',
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'docs')
  },
  devServer: {
    hot: true,
    allowedHosts: ['all'],
    static: {
      directory: './docs',
      watch: true
    }
  }
};


