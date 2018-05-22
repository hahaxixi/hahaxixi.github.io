require.register('scene.js', function(exports, require, module) {
'use strict';

var global = require('global');
var utils = require('utils')
var preloadImage = utils.preloadImage;
var game = require('game');

var FONT = '"Segoe UI", "Microsoft YaHei"';

var loadingText, title, playButton, restartButton, gameOverSprite, scoreBoardSprite, scoreText, bestScoreText;

function setLoadingText(percent) {
  percent = 89 - percent;
  if (percent <= 0)
    percent = -1;
  loadingText.setText(
    '请注意 倒车\n\n历史的行程: %s %'.replace('%s', percent)
  );
}

function createLoadingScreen() {
  loadingText = global.phaserGame.add.text(
    global.phaserGame.width / 2,
    global.phaserGame.height / 2,
    '',
    {
      font: '24pt ' + FONT,
      fill: '#f00',
      align: 'center'
    }
  );
  loadingText.anchor.setTo(0.5, 0.5);
  setLoadingText(0);
  global.phaserGame.load.onFileComplete.add(setLoadingText);
}

function createTitle() {
  title = global.phaserGame.add.text(
    global.phaserGame.width / 2,
    120,
    'FlappyWinnie',
    {
      font: 'bold 40pt Arial',
      fill: '#fff',
      align: 'center',
      stroke: '#543847',
      strokeThickness: 6
    }
  );
  title.anchor.setTo(0.5, 0.5);
  title.visible = false;
}

function createButtons() {
  playButton = global.phaserGame.add.sprite(
    global.phaserGame.width / 2,
    global.phaserGame.height / 2,
    'play'
  );
  playButton.anchor.setTo(0.5, 0.5);
  playButton.inputEnabled = true;

  // The AudioContext was not allowed to start. It must be resume (or created) after a user gesture on the page. https://goo.gl/7K7WLu
  playButton.events.onInputUp.add(function() {
    utils.unlockAudioContext();
  });

  playButton.events.onInputDown.add(function() {
    exports.shift('play');
  });
  playButton.visible = false;

  restartButton = global.phaserGame.add.sprite(
    global.phaserGame.width / 2,
    global.phaserGame.height / 2 + 100,
    'restart'
  );
  restartButton.anchor.setTo(0.5, 0.5);
  restartButton.inputEnabled = true;
  restartButton.events.onInputDown.add(function() {
    exports.shift('title');
  });
  restartButton.visible = false;
}

function createSprites() {
  gameOverSprite = global.phaserGame.add.sprite(
    global.phaserGame.width / 2,
    150,
    'gameover'
  );
  gameOverSprite.anchor.setTo(0.5, 0.5);
  gameOverSprite.visible = false;

  scoreBoardSprite = global.phaserGame.add.sprite(
    global.phaserGame.width / 2,
    280,
    'scoreboard'
  );
  scoreBoardSprite.anchor.setTo(0.5, 0.5);
  scoreBoardSprite.visible = false;
}

function createTexts() {
  var font = 'bold 20pt ' + FONT;
  var fill = '#b6975b';

  var x = scoreBoardSprite.x, y = scoreBoardSprite.y;
  x = x + scoreBoardSprite.width / 2;
  y = y - scoreBoardSprite.height / 2;
  x -= 20;
  y += 16;

  scoreText = global.phaserGame.add.text(
    x,
    y,
    '',
    {
      font: font,
      fill: fill
    }
  );
  scoreText.anchor.setTo(1, 0);
  scoreText.visible = false;

  bestScoreText = global.phaserGame.add.text(
    x,
    y + 42,
    '',
    {
      font: font,
      fill: fill
    }
  );
  bestScoreText.anchor.setTo(1, 0);
  bestScoreText.visible = false;
}

function showScore() {
  scoreText.setText(
    '连任 %s 年'.replace('%s', global.score * 5)
  );
  bestScoreText.setText(
    'BEST %s 年'.replace('%s', global.bestScore * 5)
  );

  scoreBoardSprite.visible = true;
  scoreText.visible = true;
  bestScoreText.visible = true;
}

function hideScore() {
  scoreBoardSprite.visible = false;
  scoreText.visible = false;
  bestScoreText.visible = false;
}

var sceneName = 'loading';
var scenes = {
  'loading': {
    enter: function() {
    },

    exit: function() {
      loadingText.visible = false;
    }
  },

  'title': {
    enter: function() {
      title.visible = true;
      playButton.visible = true;
    },

    exit: function() {
      title.visible = false;
      playButton.visible = false;
    }
  },

  'play': {
    enter: function() {
      game.start(function() {
        exports.shift('end');
      });
    },

    exit: function() {
    }
  },

  'end': {
    enter: function() {
      gameOverSprite.visible = true;
      restartButton.visible = true;
      showScore();
    },

    exit: function() {
      gameOverSprite.visible = false;
      restartButton.visible = false;
      hideScore();

      game.reset();
    }
  }
};

exports.shift = function(name) {
  if (sceneName === name)
      return;
  if (sceneName)
    scenes[sceneName].exit();
  sceneName = name;
  scenes[sceneName].enter();
};


exports.preload = function() {
  createLoadingScreen();

  preloadImage('play');
  preloadImage('restart');
  preloadImage('gameover');
  preloadImage('scoreboard');

  game.preload();

};

exports.create = function() {
  game.create();

  createTitle();
  createButtons();
  createSprites();
  createTexts();
};

exports.update = function() {
  game.update();
};

exports.render = function() {
  game.render();
};

});
