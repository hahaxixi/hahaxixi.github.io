require.register('main.js', function(exports, require, module) {
'use strict';

var global = require('global');
var sounds = require('sounds');
var scene = require('scene');

function preload() {
  global.phaserGame.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
  global.phaserGame.stage.scale.setScreenSize(true);

  sounds.preload();
  scene.preload();
}

function create() {
  sounds.create();
  scene.create();
  scene.shift('title');
}

function update() {
  scene.update();
}

function render() {
  scene.render();
}

exports.run = function() {
  var width = 600;
  var height = 800;

  var availWidth = document.body.offsetWidth;
  var availHeight = document.body.offsetHeight;
  if (availWidth > availHeight) {
      var w = availWidth;
      availWidth = availHeight;
      availHeight = w;
  }

  var device = new Phaser.Device();
  if (availWidth >= 320 && availHeight >= 480 && availHeight <= 1280) {
    if (!device.desktop) {
      width = availWidth;
      height = availHeight;
    }
  }
  console.log(device.desktop ? 'desktop' : 'mobile', width, 'x', height);

  global.phaserGame = new Phaser.Game(
    width,
    height,
    Phaser.AUTO,
    document.getElementById('game'),
    {
      preload: preload,
      create: create,
      update: update,
      render: render
    },
    false,
    false
  );
};

});
