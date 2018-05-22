require.register('sounds.js', function(exports, require, module) {
'use strict';

var global = require('global');
var preloadAudio = require('utils').preloadAudio;

function SoundArray(name, count) {
  this.sounds = [];
  this.name = name;
  this.count = count;
  this.currentIndex = 0;
}

SoundArray.prototype.preload = function() {
  var key, name = this.name;
  for (var i = 0, l = this.count; i < l; i++) {
    key = name + (i + 1);
    preloadAudio(key);
  }
}

SoundArray.prototype.create = function() {
  var key, name = this.name;
  for (var i = 0, l = this.count; i < l; i++) {
    key = name + (i + 1);
    this.sounds[i] = global.phaserGame.add.audio(key);
  }
}

SoundArray.prototype.random = function() {
  if (this.count === 1) {
    return;
  }
  var index = Math.floor(Math.random() * this.count);
  if (index !== this.currentIndex) {
    this.currentIndex = index;
    return;
  }
  return this.random();
}

SoundArray.prototype.getSound = function() {
  return this.sounds[this.currentIndex];
}

SoundArray.prototype.isPlaying = function() {
  return this.getSound().isPlaying;
}

SoundArray.prototype.play = function() {
  this.random();
  this.getSound().play();
}

SoundArray.prototype.stop = function() {
  this.getSound().stop();
}

function Sound(name) {
  this.sound;
  this.name = name;
}

Sound.prototype.preload = function() {
  preloadAudio(this.name);
}

Sound.prototype.create = function() {
  this.sound = global.phaserGame.add.audio(this.name);
}

Sound.prototype.getSound = function() {
  return this.sound;
}

Sound.prototype.isPlaying = function() {
  return this.getSound().isPlaying;
}

Sound.prototype.play = function() {
  this.getSound().play();
}

Sound.prototype.stop = function() {
  this.getSound().stop();
}

var sounds = {
  'crash': {single: true},
  'ouch': {single: true},
  'flap': {single: true},
  'gameover': {single: true},
  'score': {count: 7}
}

exports = function(name) {
  return sounds[name];
};

exports.preload = function() {
  var opts;
  for (var name in sounds) {
    opts = sounds[name];
    if (opts.single)
      sounds[name] = new Sound(name);
    else
      sounds[name] = new SoundArray(name, opts.count);
    sounds[name].preload();
  }
};

exports.create = function() {
  for (var name in sounds) {
    sounds[name].create();
  }
};

module.exports = exports;

});
