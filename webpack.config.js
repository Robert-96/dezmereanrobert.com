const path = require('path')

let config = {
  target: 'web',
  entry: [
    './themes/loaf/static/js/anchor.js',
    './themes/loaf/static/js/dark.js',
    './themes/loaf/static/js/copy.js',
    './themes/loaf/static/js/art.js',
  ],
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'themes', 'loaf', 'assets', 'js')
  }
}

module.exports = function(env, argv) {
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
  }

  return config;
}
