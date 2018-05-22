require.register('utils.js', function(exports, require, module) {
'use strict';

var global = require('global');

exports.preloadImage = function(key) {
  var path = 'images/' + key + '.png';
  global.phaserGame.load.image(key, path);
};

exports.preloadAudio = function(key) {
  var path = 'sounds/' + key + '.mp3';
  global.phaserGame.load.audio(key, path);
};

exports.overlapAABB = function(left1, top1, right1, bottom1, left2, top2, right2, bottom2) {
  return left1 < right2 &&
    right1 > left2 &&
    top1 < bottom2 &&
    bottom1 > top2;
};

});
