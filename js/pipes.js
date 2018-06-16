require.register('pipes.js', function(exports, require, module) {
'use strict';

var global = require('global');
var utils = require('utils');
var preloadImage = utils.preloadImage;

var settings = global.settings;

var pipeLayer;

function PipePair() {
  this.scored = false;
  this.alive = true;
  this.topPipe = pipeLayer.create(0, 0, 'pipe');
  this.bottomPipe = pipeLayer.create(0, 0, 'pipe');
}

PipePair.prototype.reset = function() {
  var gap = global.phaserGame.rnd.integerInRange(settings.gapMin, settings.gapMax);
  gap = gap / 2;
  var x = -this.topPipe.width;
  var y = global.phaserGame.height / 2 - 32;
  y += global.phaserGame.rnd.integerInRange(-50, 50);

  this.topPipe.x = x;
  this.topPipe.y = y - this.topPipe.height - gap;

  this.bottomPipe.x = x;
  this.bottomPipe.y = y + gap;

  this.scored = false;
};

PipePair.prototype.kill = function() {
  this.topPipe.visible = false;
  this.bottomPipe.visible = false;
  this.alive = false;
};

PipePair.prototype.revive = function() {
  this.topPipe.visible = true;
  this.bottomPipe.visible = true;
  this.alive = true;
};

PipePair.prototype.checkScore = function(x) {
  if (!this.alive)
    return false;

  if (this.scored)
    return false;

  if (x < this.topPipe.x) {
    this.scored = true;
    return true;
  }

  return false;
};

PipePair.prototype.checkCollision = function(left, top, right, bottom) {
  if (!this.alive)
    return false;

  if (utils.overlapAABB(left, top, right, bottom,
    this.topPipe.x, this.topPipe.y,
    this.topPipe.x + this.topPipe.width, this.topPipe.y + this.topPipe.height)) {
    return true;
  }

  if (utils.overlapAABB(left, top, right, bottom,
    this.bottomPipe.x, this.bottomPipe.y,
    this.bottomPipe.x + this.bottomPipe.width, this.bottomPipe.y + this.bottomPipe.height)) {
    return true;
  }

  return false;
};

PipePair.prototype.checkOutOfBound = function() {
  return this.topPipe.x >= global.phaserGame.world.bounds.right;
};

PipePair.prototype.moveX = function(n) {
  if (!this.alive)
    return;

  this.topPipe.x += n;
  this.bottomPipe.x += n;

  if (this.checkOutOfBound())
    this.kill();
};

PipePair.prototype.render = function() {
  global.phaserGame.debug.renderSpriteBody(this.topPipe);
  global.phaserGame.debug.renderSpriteBody(this.bottomPipe);
};


var pipeList = [], paused = true, distance = 0;

exports.checkScore = function(x) {
  for (var i = 0; i < pipeList.length; i++) {
    if (pipeList[i].checkScore(x))
      return true;
  }
  return false;
};

exports.checkCollision = function(left, top, right, bottom) {
  for (var i = 0; i < pipeList.length; i++) {
    if (pipeList[i].checkCollision(left, top, right, bottom))
      return true;
  }
  return false;
};

function reusePipe() {
  var pipe;
  for (var i = 0; i < pipeList.length; i++) {
    pipe = pipeList[i];
    if (!pipe.alive)
      return pipe;
  }
  return null;
}

function spawn() {
  var pipe = reusePipe();
  if (!pipe) {
    pipe = new PipePair();
    pipeList.push(pipe);
  } else {
    pipe.revive();
  }
  pipe.reset();
}

exports.update = function() {
  if (paused)
    return;

  var t = global.phaserGame.time.physicsElapsed;
  var s = settings.speed * t;

  pipeList.forEach(function(pipe) {
    pipe.moveX(s);
  });

  distance += s;
  if (distance >= settings.spacing) {
    distance = 0;
    spawn();
  }

  //console.log(pipeList.length);
};

exports.start = function() {
  paused = false;
};

exports.stop = function() {
  paused = true;
};

exports.reset = function() {
  pipeList.forEach(function(pipe) {
    if (pipe.alive)
      pipe.kill();
  });
  distance = 0;
};

exports.preload = function() {
  preloadImage('pipe');
};

exports.create = function() {
  pipeLayer = global.phaserGame.add.group();
};

function render(flags) {
  if (!flags)
    return;
  pipeList.forEach(function(pipe) {
    if (flags & 1)
      pipe.alive && pipe.render();
    if (flags & 2)
      !pipe.alive && pipe.render();
  });
}

exports.render = function() {
  if (settings.debug)
    render(3);
};

});
