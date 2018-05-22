require.register('main.js', function(exports, require, module) {
'use strict';

var global = require('global');
var scene = require('scene');
var pipes = require('pipes');


function preload() {
  global.phaserGame.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
  global.phaserGame.stage.scale.setScreenSize(true);

  scene.preload();
}

function create() {
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
  global.phaserGame = new Phaser.Game(
    global.settings.width,
    global.settings.height,
    Phaser.AUTO,
    document.getElementById('game'),
    {
      preload: preload,
      create: create,
      update: update,
      render: render
    }
  );

};

});
