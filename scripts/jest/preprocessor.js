var babel = require('babel-core');
var babelDefaultOptions = require('../babel/default-options');

module.exports = {
  process: function(src, path) {
    var babelOpts = Object.assign({filename: path}, babelDefaultOptions);
    return babel.transform(src, babelOpts).code;
  }
};
