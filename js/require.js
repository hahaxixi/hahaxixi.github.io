(function(global) {
  'use strict';

  var modules = {};

  var require = function(id) {
    if (!/\.js$/.test(id))
      id += '.js';
    var module = modules[id];
    if (!module.exports) {
      module.exports = {};
      module.call(this, module.exports, require, module);
    }
    return module.exports;
  };

  require.register = function(id, func) {
    modules[id] = func;
  };

  global.require = require;
})(this);
