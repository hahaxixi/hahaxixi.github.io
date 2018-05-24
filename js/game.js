require.register('game.js', function(exports, require, module) {
'use strict';

var global = require('global');
var preloadImage = require('utils').preloadImage;
var sounds = require('sounds');
var pipes = require('pipes');

var settings = global.settings;

var background, ground, bird, scoreText;

var score = 0, gameStarted = false, crashed = false, crashedGround = false;

function createBackground() {
  global.phaserGame.stage.backgroundColor = '#4ec0ca';

  var height = 512;
  background = global.phaserGame.add.tileSprite(
    0,
    global.phaserGame.world.height - height,
    global.phaserGame.world.width,
    height,
    'background'
  );
}

function createGround() {
  var height = 72;
  ground = global.phaserGame.add.tileSprite(
    0,
    global.phaserGame.height - height,
    global.phaserGame.width,
    height,
    'ground'
  );
}

function createBird() {
  bird = global.phaserGame.add.sprite(
   0,
   0,
   'winnie'
  );
  bird.anchor.setTo(0.5, 0.5);
  bird.body.collideWorldBounds = true;
}

function createScoreText() {
  scoreText = global.phaserGame.add.text(
    global.phaserGame.width / 2,
    60,
    '',
    {
      font: 'bold 24pt Arial',
      fill: '#fff',
      align: 'center',
      stroke: '#666',
      strokeThickness: 4
    }
  );
  scoreText.anchor.setTo(0.5, 0.5);
}

function updateGround() {
  if (crashed)
    return;
  var t = global.phaserGame.time.physicsElapsed;
  var v = settings.speed;
  if (!gameStarted)
    v = v / 2;
  ground.tilePosition.x += t * v;
  background.tilePosition.x += t * v / 10;
}

function updateBird() {
  if (gameStarted)
    return;
  var y = global.phaserGame.height / 2 - 20;
  bird.y = y + 8 * Math.cos(global.phaserGame.time.now / 200);
}

function resetBird() {
  bird.body.gravity.y = 0;
  bird.x = global.phaserGame.width - global.phaserGame.width / 4;
  bird.scale.setTo(1, 1);
}

function flap() {
  if (!gameStarted)
    return;

  if (!crashed) {
    bird.body.velocity.y = -settings.flap;
    sounds('flap').play();
  }
}

function crash() {
  bird.scale.setTo(1, -1);
  sounds('crash').play();
}

function crashGround() {
  bird.scale.setTo(1, -1);
  sounds('ouch').play();
}

function checkCollision() {
  if (!crashed) {
    if (
      bird.body.top <= global.phaserGame.world.bounds.top ||
      pipes.checkCollision(
        bird.body.left + 10,
        bird.body.top + 5,
        bird.body.right - 10,
        bird.body.bottom - 10)
    ) {
      stop();
      crashed = true;
      crash();

    } else if (pipes.checkScore(bird.body.left)) {
      addScore();
    }
  }

  if (!crashedGround) {
    if (bird.body.bottom >= global.phaserGame.world.bounds.bottom) {
      stop();
      crashed = true;
      crashedGround = true;
      crashGround();
      endGame();
    }
  }
}

function addScore() {
  score += 1;
  updateScoreText();
  sounds('score').play();
}

function updateScoreText() {
  scoreText.setText(
    '+ %s YEARS'.replace('%s', score * 5)
  );
}

var onGameOver;
function endGame() {
  global.score = score;
  if (!global.bestScore || global.bestScore < score) {
    global.bestScore = score;
  }

  setTimeout(function() {
    sounds('gameover').play();
    onGameOver();
  }, 500);
}

function stop() {
  if (crashed)
    return;

  pipes.stop();
}

exports.start = function(cb) {
  sounds('gameover').stop();
  onGameOver = cb;

  bird.body.gravity.y = settings.gravity;
  updateScoreText();
  scoreText.visible = true;
  pipes.start();
  gameStarted = true;

  flap();
};

exports.reset = function() {
  score = 0;
  gameStarted = false;
  crashed = false;
  crashedGround = false;

  scoreText.visible = false;

  pipes.reset();
  resetBird();
};

exports.preload = function() {
  sounds.preload();
  pipes.preload();

  preloadImage('winnie');
  preloadImage('ground');
  preloadImage('background');
};

exports.create = function() {
  sounds.create();

  createBackground();
  pipes.create();
  createBird();
  createGround();
  createScoreText();

  global.phaserGame.input.onDown.add(flap);

  exports.reset();
};

exports.update = function() {
  updateBird();
  updateGround();
  if (gameStarted) {
    checkCollision();
    pipes.update();
  }
};

exports.render = function() {
  pipes.render();
};

});
