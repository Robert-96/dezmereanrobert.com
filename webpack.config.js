const path = require('path')

let config = {
  target: 'web',
  entry: {
    app: './themes/loaf/static/js/index.js',
    dark: './themes/loaf/static/js/dark.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'themes', 'loaf', 'assets', 'js')
  }
}

module.exports = function(env, argv) {
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
  }

  return config;
}
