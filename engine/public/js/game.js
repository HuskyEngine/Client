const MAX_FPS    = 0;
let interval     = 1000/MAX_FPS;
let lastTime     = Date.now();
let currentTime  = 0;
let delta        = 0;

// Game namespace object
let game = {

  // Hold all game assets
  assets: {
    animations: {},
    sprites:    {},
    sounds:     {},
    images:     {}
  },

  // Cache game scenes (WIP)
  cache:  {},
  config: {},

  // Touch events
  ee: new EventEmitter(),

  // Button info
  button: {
    data:  {},
    held:  {},
    names: []
  },

  // Key info
  key: {
    data:  {},
    held:  {}
  },

  // Main canvas
  canvas: {
    ctx:     null,
    element: null,

    // Determine scale for buttons and UI elements
    mult: {
      width:  1,
      height: 1
    },
    rect:    null,
    width:   0,
    height:  0,

    // Real width/height of canvas
    rwidth:  0,
    rheight: 0
  },

  // Helper functions
  helpers:     {},

  // Holds setIntervals/timeouts (automatically purged on helpers.load)
  intervals:   [],
  timeouts:    [],

  // Hold canvas layers
  layers: {
    game: {
      ctx:     null,
      element: null,

      // Determine scale for buttons and UI elements
      mult: {
        width:  1,
        height: 1
      },
      rect:    null,
      width:   0,
      height:  0,

      // Real width/height of canvas
      rwidth:  0,
      rheight: 0
    },
    ui:   {
      ctx:     null,
      element: null,

      // Determine scale for buttons and UI elements
      mult: {
        width:  1,
        height: 1
      },
      rect:    null,
      width:   0,
      height:  0,

      // Real width/height of canvas
      rwidth:  0,
      rheight: 0
    }
  },

  // Holds arguments passed into currently loaded scene
  loadArgs:    {},

  // Logic loop
  logicFrame:  0,
  logicLoop:   null,
  logicReady:  false,

  // Map data
  map: {
    name: null,
    src:  null,
    grid: [],
    quadrants: [],
    reflections: [],
    cover: [],
    coverTiles: [625, 577, 593, 609, 608, 592, 533, 560, 561, 570, 571, 586, 587, 568, 569, 584, 585, 864, 865, 866, 867, 868, 644, 645, 646, 647, 725, 726, 727, 720, 721, 722, 723, 724, 656, 657, 658, 659, 1272, 1273, 1274, 1275, 1276]
  },

  // Render loop
  renderFrame: 0,
  renderLoop:  null,
  renderReady: false,

  // Hold all canvases that are to be saved and reused
  scopes: {},

  // Hold all of the scripts passed in by loadedscene
  scripts: {
    init()      {},
    layout:     {},
    logic()     {},
    render()    {},
    onHold()    {},
    onTap()     {},
    onTouch()   {},
    onUntouch() {}
  },

  settings: {},

  // Global vars to be shared between scenes
  vars: {

    // Sim/Network info
    _info: {
      showInfo: true,
      sim: 0,
      render: 0,
      rate: 0,
      fps: 0,
      tmpFrame: 0,
      simLastCalled: Date.now(),
      renderLastCalled: Date.now(),
      lastFrameCalled: Date.now(),
      lastCalled: Date.now(),
      lastFrameCount: 0,
      tilePreview: document.createElement("canvas")
    },

    _console: {
      content: "",
      enabled: true,
      display: false,
      history: [],
      log: [],
      historyIndex: 0,
      match: ""
    },
    _mobileCheckOverride: null,
    _reflectionStep: 0

  },

  // Local vars for a scene (automatically purged on helpers.load)
  local: {}
};

$.get('config', (data) => {
  game.vars.config = data;
  game.vars.defaultFont = data.defaultFont;
  game.vars._info.showInfo = data.debug;
  game.settings.multiplier = data.multiplier;
  game.settings.tilesize = data.tilesize;
  game.settings.quadrantsize = data.quadrantsize;

  game.vars._info.tilePreview.width = 112;
  game.vars._info.tilePreview.height = data.tilesize;
  game.vars._info.tilePreview.style.width = 112 + "px";
  game.vars._info.tilePreview.style.height = data.tilesize + "px";
  game.vars._info.tilePreview.ctx = game.vars._info.tilePreview.getContext('2d');

  game.vars._info.tilePreview.ctx.imageSmoothingEnabled   = false;

  game.canvas.rwidth  = 512 * game.settings.multiplier;
  game.canvas.rheight = 288 * game.settings.multiplier;
});

$(() => {
  //$("#canvas").attr({height: game.canvas.rheight, width: game.canvas.rwidth});
  // Remove 300ms delay on mobile devices
  FastClick.attach(document.body);

  // TODO: Prevent google chrome pull down to refresh
  // Don't allow scrolling on mobile
  $(document).bind('touchmove', false);

  // Set up main canvas references
  game.canvas.element = $("#canvas")[0];
  game.canvas.ctx     = game.canvas.element.getContext('2d');
  game.canvas.rect    = game.canvas.element.getBoundingClientRect();

  // Set up game and ui layers
  game.layers.game.element = document.createElement("canvas");
  game.layers.game.ctx     = game.layers.game.element.getContext('2d');
  game.layers.game.rect    = game.layers.game.element.getBoundingClientRect();

  game.layers.ui.element = document.createElement("canvas");
  game.layers.ui.ctx     = game.layers.ui.element.getContext('2d');
  game.layers.ui.rect    = game.layers.ui.element.getBoundingClientRect();

  // Keep things pixelated
  game.canvas.ctx.imageSmoothingEnabled      = false;
  game.layers.game.ctx.imageSmoothingEnabled = false;
  game.layers.ui.ctx.imageSmoothingEnabled   = false;

  // TODO: Need a work around for Android
  // Check to see if application is "installed" (only iOS, doesn't work on Android)
  /*
  if (!window.navigator.standalone) {
    alert('Please install to your homescreen plox');
  }
  */

  // Touch detection
  canvas.addEventListener("touchstart", e => {
    e.preventDefault();
    game.helpers.updateButtons(e);
  }, false);

  canvas.addEventListener("touchend", e => {
    e.preventDefault();
    game.helpers.updateButtons(e, true);
  }, false);

  canvas.addEventListener("touchmove", e => {
    e.preventDefault();
    game.helpers.updateButtons(e);
  }, false);

  // Key detection
  document.addEventListener("keydown", e => {
    e.preventDefault();
    game.helpers.updateKeys(e);
  }, false);

  document.addEventListener("keyup", e => {
    e.preventDefault();
    game.helpers.updateKeys(e, true);
  }, false);
  ///////////////////

  // Resize on first load to properly init canvas
  game.helpers.resize();

  // Run resize on orientation change and window resize events
  window.addEventListener('resize',            game.helpers.resize);
  window.addEventListener('orientationchange', game.helpers.resize);

  // Load the load scene first
  // Load will get assets ready, perform checks, show powered by husky engine, etc.
  game.helpers.load();
});

/* Order of execution
  game.helpers.load('scene')
  
  load -> init(cb) -> logicLoop (runs at least once before render loop) -> render
*/

function render() {
  game.vars._info.renderLastCalled = Date.now();
  if (!game.renderReady) return;

  // Pass in current frame for timing logic
  game.renderLoop = requestAnimationFrame(render);
  currentTime = Date.now();
  delta = (currentTime-lastTime);

  if ((MAX_FPS !== 0 && delta > interval) || MAX_FPS === 0) nextFrame();

  function nextFrame() {
    // Calculate FPS
    if (Date.now() - game.vars._info.lastCalled >= 1000) {
      game.vars._info.fps = game.vars._info.tmpFrame;
      if (game.vars._info.fps <= 0) game.vars._info.fps = 0;
      game.vars._info.tmpFrame = 0;
      game.vars._info.lastCalled = Date.now();
    }

    game.scripts.render(++game.renderFrame);
    game.vars._info.tmpFrame++;

    // Display FPS
    if (game.vars._info.showInfo) {
      let oldAlpha = alpha();
      let oldFill  = fillStyle();

      alpha(.6);
      fillStyle('black');
      game.canvas.ctx.fillRect(0, 0, 750, 250);
      fillStyle('white');
      alpha(1);

      // vars
      let fps  = game.vars._info.fps.toFixed(1);
      let sim  = game.vars._info.sim;
      let ren  = game.vars._info.render;

      if (fps < (game.vars._info.rate - game.vars._info.rate * .05)) fillStyle('orange');
      if (fps < (game.vars._info.rate - game.vars._info.rate * .15)) fillStyle('red');
      text("fps:  " + fps, "24pt Arial", 0, 30);
      fillStyle('white');

      if (sim > 1000/game.vars._info.rate) fillStyle('red');
      text("sim: " + sim + " ms", "24pt Arial", 0, 60);
      fillStyle('white');

      if (ren > 1000/game.vars._info.rate) fillStyle('red');
      text("ren: " + ren + " ms", "24pt Arial", 0, 90);
      fillStyle('white');

      let pos  = game.helpers.getPos();

      if (pos.x > 0 && pos.y > 0 && pos.x <= game.map.src.length && pos.y <= game.map.src[0].length) {
        let feet = (game.map !== undefined && pos.x !== "-") ? JSON.stringify(game.map.src[pos.y-1][pos.x-1]) : "[null, null]";

        text("pos: [" + pos.x + "," + pos.y + "] [" + pos.dir + "]", "24pt Arial", 0, 120);
        text("feet: " + feet, "24pt Arial", 0, 150);

        if (game.map.quadrants.length !== 0) {
          let pos = game.helpers.getPos();
          let xquad = pos.quad[0];
          let yquad = pos.quad[1];
          text("quads: " + game.map.quadrants[0].length * game.map.quadrants.length + " @ " + game.settings.quadrantsize + "px x " + game.settings.quadrantsize + "px (multiplier: " + game.settings.multiplier + ", tilesize: " + game.settings.tilesize + ")", "24pt Arial", 0, 180);
          text("curquad: [" + xquad + "," + yquad + "] [" + pos.quad[2] + "," + pos.quad[3] + "]", "24pt Arial", 0, 210);
        }

        // Tile preview
        game.vars._info.tilePreview.ctx.clearRect(0, 0, 112, 32)
        game.vars._info.tilePreview.ctx.drawImage(game.assets.images['tilesheet.png'], (game.map.src[pos.y-1][pos.x-1][0] % 16) * 16, Math.floor(game.map.src[pos.y-1][pos.x-1][0] / 16) * 16, 16, 16, 0, 0, 32, 16);
        game.vars._info.tilePreview.ctx.drawImage(game.assets.images['tilesheet.png'], (game.map.src[pos.y-1][pos.x-1][1] % 16) * 16, Math.floor(game.map.src[pos.y-1][pos.x-1][1] / 16) * 16, 16, 16, 40, 0, 32, 16);
        game.vars._info.tilePreview.ctx.drawImage(game.assets.images['tilesheet.png'], (game.map.src[pos.y-1][pos.x-1][0] % 16) * 16, Math.floor(game.map.src[pos.y-1][pos.x-1][0] / 16) * 16, 16, 16, 80, 0, 32, 16);
        game.vars._info.tilePreview.ctx.drawImage(game.assets.images['tilesheet.png'], (game.map.src[pos.y-1][pos.x-1][1] % 16) * 16, Math.floor(game.map.src[pos.y-1][pos.x-1][1] / 16) * 16, 16, 16, 80, 0, 32, 16);

        game.canvas.ctx.drawImage(game.vars._info.tilePreview, 190, 125, 112, 32);
      }

      fillStyle(oldFill);
      alpha(oldAlpha);
    }

    lastTime = currentTime - (delta % interval);

    // Display Console
    consoleDisplay();

    game.vars._info.lastFrameCalled = Date.now();
    game.vars._info.render = Date.now() - game.vars._info.renderLastCalled;
  }
}

game.logicLoop = setInterval(() => {
  game.vars._info.simLastCalled = Date.now();
  if (!game.logicReady) return;

  let holdDelay = game.settings.holdDelay;

  // Logic loop 1st pass is complete, render loop is now ready
  if (game.logicFrame === 2) {
    game.renderReady = true;
    render();
  }

  // Buttons
  _.each(game.button.data, (data, button) => {

    // Touch event
    // Emit touch event the instant a touch is detected
    if (!game.button.data[button].touched) {

      // Set touched flag so it only emits once
      game.button.data[button].touched = true;
      game.ee.emit('touch', button);
    }

    // Hold event if holdDelay threshold is met
    if (game.button.held[button] !== undefined && Date.now() - game.button.data[button].start > holdDelay) {
      game.ee.emit('hold', button);
    }
  });

  // Keys
  _.each(game.key.data, (data, key) => {

    // Touch event
    // Emit touch event the instant a touch is detected
    if (!game.key.data[key].touched) {

      // Set touched flag so it only emits once
      game.key.data[key].touched = true;
      consoleHandler(key);

      // Don't let console input leak through when opened
      if (!game.vars._console.display) {
        game.ee.emit('keyTouch', key);
      }
    }

    // Hold event if holdDelay threshold is met
    if (game.key.held[key] !== undefined && Date.now() - game.key.data[key].start > holdDelay) {
      consoleHandler(key);

      // Don't let console input leak through when opened
      if (!game.vars._console.display) {
        game.ee.emit('keyHold', key);
      }
    }
  });

  // Pass in logic frame for timing
  game.scripts.logic(++game.logicFrame);

  game.vars._reflectionStep++;

  if (game.vars._reflectionStep % 30 === 0) {
    game.vars.rand0 = getRandomIntInclusive(-2,2);
  } else if (game.vars._reflectionStep % 30 === 5) {
    game.vars.rand3 = getRandomIntInclusive(-2,2);
  } else if (game.vars._reflectionStep % 30 === 10) {
    game.vars.rand2 = getRandomIntInclusive(-2,2);
  } else if (game.vars._reflectionStep % 30 === 15) {
    game.vars.rand4 = getRandomIntInclusive(-2,2);
  } else if (game.vars._reflectionStep % 30 === 20) {
    game.vars.rand1 = getRandomIntInclusive(-2,2);
  }

  game.vars._info.sim = Date.now() - game.vars._info.simLastCalled;
}, 1000/60);

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
