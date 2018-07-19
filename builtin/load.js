// Init script
game.scripts.init = (cb) => {
  game.local = {
    loaded: false,
    alpha: 0,
    fontSize: 10,
    huskyLoaded: false,
    loadedFrame: 0,
    loadedTime: 0,
    huskySize: 10,
    fadeAway: 1,
    loadMain: false,
    filesLoaded: 0,
    totalFiles: 0,
    start: Date.now(),
    initGameLayer: false,
    prev: fillStyle(L_UI),
    nosleep: 0,
    fps: store.get('fps'),
    fpsNotSet: undefined
  };

  game.local.elapsed = () => Date.now() - game.local.start;
  game.helpers.scope('console');
  game.helpers.scope('controls');

  game.local.fpsNotSet = game.local.fps === undefined;

  game.helpers.resize();
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
  if (game.local.fpsNotSet) {
    game.local.nosleep++;
    if (frame === 240) {
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
        game.vars._info.rate = 60;
      }
      store.set('fps', game.vars._info.rate);
    }
  } else {
    game.vars._info.rate = store.get('fps');
  }

  // Load assets and update progress
  if (frame === (game.local.fpsNotSet ? 240 : 10)) {
    game.helpers.loadAssets(() => {
      //game.helpers.renderControls();
      game.local.loaded = true;
    });
  }

  if (frame > (game.local.fpsNotSet ? 240 : 1)) {
    // Everything loaded, so fade away and load main
    if (!game.local.loadMain && game.local.elapsed() > (game.local.fpsNotSet ? 5000 : 2000)) {
      game.local.fadeAway -= .01;
      if (game.local.fadeAway < 0) {
        game.local.fadeAway = 0;
        game.local.loadMain = true;
      }
      alpha(game.local.fadeAway, L_UI);
    }
    if (game.local.loadMain) {
      game.helpers.load('main');
    }
    if (Date.now() - game.local.loadedTime < 1500) {
      if (game.local.alpha <= 1) game.local.alpha += .01;
      if (game.local.huskySize <= 150) game.local.huskySize += 2.25;
      alpha(1, L_UI);

      if (game.local.fontSize < 10) game.local.fontSize += .5;
      else if (game.local.fontSize < 15) game.local.fontSize += .4;
      else if (game.local.fontSize < 20) game.local.fontSize += .3;
      else if (game.local.fontSize < 25) game.local.fontSize += .2;
      else if (game.local.fontSize < 30) game.local.fontSize += .1;
    }
  }
};

// Game render loop
game.scripts.render = (frame) => {
  fillStyle("#FFF", L_GAME);
  fillRect(0, 0, 100, 100, L_GAME);

  if (game.vars._info.rate === 0) {
    let oldStyle = fillStyle(L_UI);
    clearRect(28, 38, 42, 20, L_UI);
    fillStyle("black", L_UI);
    text("Running initial setup...", {size: 30, font: "Arial"}, "center", "center", L_UI);
    fillStyle(oldStyle, L_UI);
  }

  if (!game.local.huskyLoaded) return;
  if (!game.local.initGameLayer) {
    game.local.initGameLayer = true;
  }

  clearRect(28, 38, 42, 20, L_UI);

  // File name
  clearRect(18, 75, 64, 20, L_UI);
  alpha(game.local.fadeAway, L_UI);
  text(game.local.fileName, {size: 16, font: "Arial"}, "center", 82, L_UI);

  // Progress bar
  fillStyle("#00F", L_UI);
  fillRect(20, 83.5, (game.local.filesLoaded/game.local.totalFiles)*60, 4, L_UI);
  fillStyle(game.local.prev, L_UI);

  // Change percentage font to white
  if (game.local.filesLoaded/game.local.totalFiles > .5) {
    fillStyle("#FFF", L_UI);
  }

  // Percentage text
  text(((game.local.filesLoaded/game.local.totalFiles)*100) + "%", {size: 16, font: "Arial"}, "center", 86.5, L_UI);
  fillStyle(game.local.prev, L_UI);

  // Files loaded fraction
  text(game.local.filesLoaded + " / " + game.local.totalFiles, {size: 16, font: "Arial"}, "center", 91, L_UI);

  clearRect(40, 10, 20, 60, L_UI);
  // fillStyle('CCC', L_UI);
  // alpha(0.5, L_UI)
  // fillRect(40, 20, 20, 40, L_UI);

  // fillStyle(game.local.prev, L_UI);

  // Alpha
  if (game.local.fadeAway === 1) {
    alpha(game.local.alpha, L_UI);
  } else {
    alpha(game.local.fadeAway, L_UI);
  }


  text("Powered By", {size: game.local.fontSize, font: "Arial"}, "center", (((365-(((game.local.huskySize)/2)*1.25))/1152)*100), L_UI);
  //drawImage('huskyengine', (L_UI.element.width/2-((game.local.huskySize)/2)), (L_UI.element.height/2-((game.local.huskySize)/2)-125+((game.local.huskySize)/6)), (game.local.huskySize), (game.local.huskySize), L_UI);
  drawImage('huskyengine', 50-(game.local.huskySize/20), 50-(game.local.huskySize/50)-27, game.local.huskySize/10, game.local.huskySize/4.5, L_UI);
  text("Husky Engine", {size: game.local.fontSize, font: "Arial"}, "center", ((510+(((game.local.huskySize)/2)*1.6))/1152)*100, L_UI);
};
