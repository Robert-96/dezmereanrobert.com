/*eslint-env es6*/
const path = require('path')

module.exports = {
  entry: {
    app: './themes/loaf/static/js/index.js',
    dark: './themes/loaf/static/js/dark.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'themes', 'loaf', 'assets', 'js')
  }
}
