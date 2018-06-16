require.register('sounds.js', function(exports, require, module) {
'use strict';

var global = require('global');
var preloadAudio = require('utils').preloadAudio;
var settings = global.settings;

function SoundArray(name, opts) {
  this.sounds = [];
  this.name = name;
  this.count = opts.count;
  this.currentIndex = 0;
  this.recentIndex = 0;
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
  if (this.count < 5) {
    this.currentIndex = index;
    return;
  }
  if (index !== this.currentIndex && index !== this.recentIndex) {
    this.recentIndex = this.currentIndex;
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

var sounds;

exports = function(name) {
  return sounds[name];
};

exports.preload = function() {
  sounds = {
    'crash': {},
    'ouch': {},
    'flap': {},
    'gameover': {},
    'score': {count: settings.scoreSounds}
  };

  var opts;
  for (var name in sounds) {
    opts = sounds[name];
    if (opts.count)
      sounds[name] = new SoundArray(name, opts);
    else
      sounds[name] = new Sound(name);
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
