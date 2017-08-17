// Init script
game.scripts.init = (cb) => {
  game.local = {
    loaded: false,
    poweredByFont: 10,
    engineAlpha: 0,
    engineFont: 10,
    huskyLoaded: false,
    loadedFrame: 0,
    loadedTime: 0,
    huskyAlpha: 0,
    huskySize: 10,
    poweredByAlpha: 0,
    fadeAway: 1,
    loadMain: false,
    filesLoaded: 0,
    totalFiles: 0,
    start: Date.now()
  };

  game.local.elapsed = () => Date.now() - game.local.start;
  cb();
};

// Button Listeners
game.scripts.onTouch = (button) => {

};

game.scripts.onTap = (button) => {

};

game.scripts.onHold = (button) => {

};

game.scripts.onUntouch = (button) => {

};


// Keyboard listeners
game.scripts.onKeyTouch = (key) => {

};

game.scripts.onKeyTap = (key) => {

};

game.scripts.onKeyHold = (key) => {

};

game.scripts.onKeyUntouch = (key) => {

};


// Button layout
game.scripts.layout = {

};

// Game logic loop
game.scripts.logic = (frame) => {
  // Load assets and update progress
  if (frame === 1) {
    game.helpers.loadAssets(() => {
      game.helpers.loadMap('default');
    });
  }

  if (frame > 1) {
    // Everything loaded, so fade away and load main
    if (!game.local.loadMain && game.local.loaded && game.local.elapsed() > 2000) {
      game.local.fadeAway -= .01;
      if (game.local.fadeAway < 0) {
        game.local.fadeAway = 0;
        game.local.loadMain = true;
      }
      alpha(game.local.fadeAway);
    }
    if (game.local.loadMain) {
      let fps = game.vars._info.fps;
      if (fps <= 70) {
        game.vars._info.rate = 60;
      } else if (fps <= 95) {
        game.vars._info.rate = 85;
      } else if (fps <= 110) {
        game.vars._info.rate = 100;
      } else if (fps <= 130) {
        game.vars._info.rate = 120;
      } else if (fps <= 154) {
        game.vars._info.rate = 144;
      } else {
        game.vars._info.rate = game.vars._info.fps;
      }
      game.helpers.load('main');
    }
    if (Date.now() - game.local.loadedTime < 1500) {
      if (game.local.poweredByFont < 10) game.local.poweredByFont += .5;
      else if (game.local.poweredByFont < 20) game.local.poweredByFont += .4;
      else if (game.local.poweredByFont < 30) game.local.poweredByFont += .3;
      else if (game.local.poweredByFont < 40) game.local.poweredByFont += .2;
      else if (game.local.poweredByFont < 50) game.local.poweredByFont += .1;
    }
    if (Date.now() - game.local.loadedTime < 1500) {
      game.local.poweredByAlpha += .01;
      alpha(1);
    }
    if (Date.now() - game.local.loadedTime < 1500) {
      game.local.huskyAlpha += .01;
      game.local.huskySize += 3;
      alpha(1);
    }
    if (Date.now() - game.local.loadedTime < 1500) {
      if (game.local.engineFont < 10) game.local.engineFont += .5;
      else if (game.local.engineFont < 20) game.local.engineFont += .4;
      else if (game.local.engineFont < 30) game.local.engineFont += .3;
      else if (game.local.engineFont < 40) game.local.engineFont += .2;
      else if (game.local.engineFont < 50) game.local.engineFont += .1;
    }
    if (Date.now() - game.local.loadedTime < 1500) {
      game.local.engineAlpha += .01;
      alpha(1);
    }
  }
};


// Game render loop
game.scripts.render = (frame) => {
  if (!game.local.huskyLoaded) return;
  game.animations.clear();

  alpha(game.local.fadeAway);
  text(game.local.fileName, "16pt Arial", "center", 950);

  let prev = fillStyle();
  fillStyle("#00F");
  game.canvas.ctx.fillRect(game.canvas.rwidth*.2, 960, (game.local.filesLoaded/game.local.totalFiles)*(game.canvas.rwidth*.8-game.canvas.rwidth*.2), 50);
  fillStyle(prev);

  if (game.local.filesLoaded/game.local.totalFiles > .5) {
    fillStyle("#FFF");
  }
  text(((game.local.filesLoaded/game.local.totalFiles)*100).toFixed(2) + "%", "20pt Arial", "center", 995);
  fillStyle(prev);

  text(game.local.filesLoaded + " / " + game.local.totalFiles, "16pt Arial", "center", 1050);

  // Powered By
  alpha(game.local.poweredByAlpha);
  alpha(game.local.fadeAway);
  text("Powered By", game.local.poweredByFont + "pt Arial", "center", 365-((game.local.huskySize/4)*1.25));

  alpha(game.local.huskyAlpha);
  alpha(game.local.fadeAway);
  drawImage('huskyengine', game.canvas.rwidth/2-(game.local.huskySize/2), game.canvas.rheight/2-(game.local.huskySize/2)-200+(game.local.huskySize/4), game.local.huskySize, game.local.huskySize);

  alpha(game.local.engineAlpha);
  alpha(game.local.fadeAway);

  text("Husky Engine", game.local.engineFont + "pt Arial", "center", 410+((game.local.huskySize/2)*1.6));

};
