const MAX_FPS = 0;
let L_MAIN;   // Off screen canvas
let L_GAME;   // Games tiles
let L_UI;     // UI/Text elements

// Game namespace object
let game = {

  // Hold all game assets
  assets: {
    animations: {},
    sprites:    {},
    sounds:     {},
    images:     {},
    tilesheets: {},
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
    _scale:   1,
    scale(val) {
      if (val === undefined) return this._scale;
      else {
        // Save original vals
        if (this.element._height === undefined) {
          this.element._height = this.element.height;
          this.element._width = this.element.width;
        }
        this._scale = val;
        this.element.height = this.element._height * this._scale;
        this.element.width  = this.element._width * this._scale;
        this.ctx.imageSmoothingEnabled = false;
        return this._scale;
      }
    }
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
      rect:    null,
    },
    ui:   {
      ctx:     null,
      element: null,
      rect:    null,
    }
  },

  // Holds arguments passed into currently loaded scene
  loadArgs:    {},

  // Logic loop
  logicFrame:  0,
  logicLoop:   undefined,
  logicReady:  false,

  // Render loop
  renderFrame: 0,
  renderLoop:  undefined,
  renderReady: false,

  // Map data
  map: {
    name: null,
    src:  null,
    grid: [],
    quadrants: [],
    reflections: [],
    cover: []
  },

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

  settings: {
    baseFont: 1000
  },

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
      lastCancel: Date.now()
    },

    _fps: {
      logicTime: Date.now(),
      renderTime: Date.now(),
      currentTime: 0,
      delta: 0,
      limit: MAX_FPS,
      userSet: MAX_FPS,
      lastTime: Date.now(),
      update(limit, override=false) {
        if (limit > store.get('fps')) limit = store.get('fps');
        if (!override) {
          game.vars._fps.userSet = limit;
        }
        game.vars._fps.limit    = limit;
        game.vars._fps.interval = 1000/limit;
      },
      history: queue(5),
      historyTime: queue(50),
      renHistory: queue(5),
      renHistoryTime: queue(50),
      lastChange: Date.now(),
      increased: false,
      dynamicInterval: undefined,
      auto: false
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
    _reflectionStep: 0,
    _hash: null,
    _hashTime: Date.now(),
    _sleeping: false,
    _controlsHash: null,
    _wakeup: Date.now(),
    _sleep: false

  },

  // Local vars for a scene (automatically purged on helpers.load)
  local: {}
};

$.get('config', (data) => {
  game.vars._fps.update(MAX_FPS);
  game.vars.config = data;
  game.vars.defaultFont = data.defaultFont;
});

$(() => {
  // Resize on first load to properly init canvas
  game.helpers.resize();

  // Remove 300ms delay on mobile devices
  FastClick.attach(document.body);

  // TODO: Prevent google chrome pull down to refresh
  // https://developers.google.com/web/updates/2017/11/overscroll-behavior
  // Don't allow scrolling on mobile
  $(document).bind('touchmove', false);

  L_MAIN = game.canvas;
  L_MAIN.element = $("#canvas")[0];

  // Apply main canvas settings
  L_MAIN.element.width  = ~~L_MAIN.element.style.width.slice(0, -2);
  L_MAIN.element.height  = ~~L_MAIN.element.style.height.slice(0, -2);

  L_MAIN.ctx  = L_MAIN.element.getContext('2d');
  L_MAIN.rect = L_MAIN.element.getBoundingClientRect();
  L_MAIN.name = "main";

  // Set up game and ui layers
  L_GAME = game.layers.game;
  L_GAME.element = document.createElement("canvas");
  L_GAME.element.width  = L_MAIN.element.width;
  L_GAME.element.height = L_MAIN.element.height;
  L_GAME.ctx  = L_GAME.element.getContext('2d');
  L_GAME.rect = L_GAME.element.getBoundingClientRect();
  L_GAME.name = "game";

  L_UI = game.layers.ui;
  L_UI.element = document.createElement("canvas");
  L_UI.element.width  = L_MAIN.element.width;
  L_UI.element.height = L_MAIN.element.height;
  L_UI.ctx     = L_UI.element.getContext('2d');
  L_UI.rect    = L_UI.element.getBoundingClientRect();
  L_UI.name    = "UI";


  // Keep things pixelated
  L_MAIN.ctx.imageSmoothingEnabled = false;
  L_GAME.ctx.imageSmoothingEnabled = false;
  L_UI.ctx.imageSmoothingEnabled   = false;

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
    if (!e.metaKey) e.preventDefault();
    game.helpers.updateKeys(e);
  }, false);

  document.addEventListener("keyup", e => {
    if (!e.metaKey) e.preventDefault();
    e.preventDefault();
    game.helpers.updateKeys(e, true);
  }, false);
  ///////////////////

  // Run resize on orientation change and window resize events
  window.addEventListener('resize',            game.helpers.resize);
  window.addEventListener('orientationchange', (event) => {
    setTimeout(() => {
      game.helpers.resize();
    }, 250);
  });

  // Load the load scene first
  // Load will get assets ready, perform checks, show powered by husky engine, etc.
  game.helpers.load();

  // Start logic loop
  logic();

  // Auto fps
  // Auto fps isn't really that great yet and
  // tends to end up in an infinite pessimistic loop
  if (game.vars._fps.auto) game.helpers.autofps();
});

/* Order of execution
  game.helpers.load('scene')
  
  load -> init(cb) -> logicLoop (runs at least once before render loop) -> render
*/

function render() {
  if (!game.renderReady) return;

  // Pass in current frame for timing logic
  game.renderLoop = requestAnimationFrame(render);
  if (Date.now() - game.vars._hashTime > 500 && game.vars._hash === game.helpers.hash()) {
    game.vars._fps.update(1, true);
    game.vars._sleeping = true;
  } else if (game.vars._sleeping) {
    game.vars._fps.update(game.vars._fps.userSet, true);
    game.vars._sleeping = false;
    game.vars._wakeup   = Date.now();
  }

  game.vars._info.renderLastCalled = Date.now();

  game.vars._fps.currentTime = Date.now();
  game.vars._fps.delta = (game.vars._fps.currentTime-game.vars._fps.lastTime);

  if (game.vars._script !== "load" && Date.now() - game.vars._info.lastCancel > 3000 && game.vars._info.fps > game.vars._info.rate*1.1) {
    window.cancelAnimationFrame(game.renderLoop);
    game.vars._info.lastCancel = Date.now();
  }
  if (game.vars._fps.limit === 0 || (game.vars._fps.limit !== 0 && game.vars._fps.delta >= game.vars._fps.interval)) nextFrame();

  function nextFrame() {
    game.vars._fps.renHistoryTime.push(Date.now() - game.vars._fps.renderTime);
    game.vars._fps.renderTime = Date.now();
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
      let oldAlpha = alpha(L_UI);
      let oldFill  = fillStyle(L_UI);

      clearRect(0, 0, 40, 22, L_UI);
      alpha(.6, L_UI);
      fillStyle('black', L_UI);
      fillRect(0, 0, 40, 22, L_UI);
      fillStyle('white', L_UI);
      alpha(1, L_UI);

      // vars
      let line = 3;
      let fps  = game.vars._info.fps.toFixed(0);
      let sim  = game.vars._info.sim;
      let ren  = game.vars._info.render;

      if (!game.vars._sleeping && fps < (game.vars._info.rate - game.vars._info.rate * .05)) fillStyle('orange', L_UI);
      if (!game.vars._sleeping && fps < (game.vars._info.rate - game.vars._info.rate * .15)) fillStyle('red', L_UI);

      text("fps:  " + fps + " [" + game.vars._fps.limit.toFixed(0) + "]" + (game.vars._sleeping ? " (sleeping)" : ""), {size: 18, font: "Arial"}, 0, line*1, L_UI);
      fillStyle('white', L_UI);

      if (sim > 1000/game.vars._info.rate) fillStyle('red', L_UI);
      text("sim: " + sim + " ms\t-\t" + game.vars._fps.historyTime.min().toFixed(0) + "/" + game.vars._fps.historyTime.avg().toFixed(0) + "/" + game.vars._fps.historyTime.max().toFixed(0) + " ms", {size: 18, font: "Arial"}, 0, line*2, L_UI);
      fillStyle('white', L_UI);

      if (ren > 1000/game.vars._info.rate) fillStyle('red', L_UI);
      text("ren: " + ren + " ms\t-\t" + game.vars._fps.renHistoryTime.min().toFixed(0) + "/" + game.vars._fps.renHistoryTime.avg().toFixed(0) + "/" + game.vars._fps.renHistoryTime.max().toFixed(0) + " ms", {size: 18, font: "Arial"}, 0, line*3, L_UI);
      fillStyle('white', L_UI);

      text(`frames: logic=${game.logicFrame} render=${game.renderFrame} diff=${Math.abs(game.logicFrame - game.renderFrame)}`, {size: 18, font: "Arial"}, 0, line*4, L_UI);

      let pos = game.helpers.getPos();

      // if (game.helpers.tileAt(pos.x-1, pos.y-1, true)) {
      //   let feet = game.helpers.tileAt(pos.x-1, pos.y-1);

      //   text("pos: [" + pos.x + "," + pos.y + "] [" + pos.dir + "]", "24pt Arial", 0, line*4, L_UI);
      //   text("feet: " + feet, "24pt Arial", 0, line*5, L_UI);

      //   if (game.map.quadrants.length !== 0) {
      //     let pos = game.helpers.getPos();
      //     let xquad = pos.quad[0];
      //     let yquad = pos.quad[1];
      //     text("quads: " + game.map.quadrants[0].length * game.map.quadrants.length + " @ " + game.settings.quadrantsize + "px x " + game.settings.quadrantsize + "px (multiplier: " + game.settings.multiplier + ", tilesize: " + game.settings.tilesize + ")", "24pt Arial", 0, line*6, L_UI);
      //     text("curquad: [" + xquad + "," + yquad + "] [" + pos.quad[2] + "," + pos.quad[3] + "]", "24pt Arial", 0, line*7, L_UI);
      //   }

      //   // Tile preview
      //   clearRect(0, 0, 112, 32, game.helpers.scope('tilePreview'));
      //   drawTile('default.png', (game.helpers.tileAt(pos.x-1, pos.y-1)[0] % 16) * 16, Math.floor(game.helpers.tileAt(pos.x-1, pos.y-1)[0] / 16) * 16, 16, 16, 0, 0, 32, 16,  game.helpers.scope('tilePreview'));
      //   drawTile('default.png', (game.helpers.tileAt(pos.x-1, pos.y-1)[1] % 16) * 16, Math.floor(game.helpers.tileAt(pos.x-1, pos.y-1)[1] / 16) * 16, 16, 16, 40, 0, 32, 16, game.helpers.scope('tilePreview'));
      //   drawTile('default.png', (game.helpers.tileAt(pos.x-1, pos.y-1)[0] % 16) * 16, Math.floor(game.helpers.tileAt(pos.x-1, pos.y-1)[0] / 16) * 16, 16, 16, 80, 0, 32, 16, game.helpers.scope('tilePreview'));
      //   drawTile('default.png', (game.helpers.tileAt(pos.x-1, pos.y-1)[1] % 16) * 16, Math.floor(game.helpers.tileAt(pos.x-1, pos.y-1)[1] / 16) * 16, 16, 16, 80, 0, 32, 16, game.helpers.scope('tilePreview'));

      //   drawImage(game.helpers.scope('tilePreview').element, 190, 125, 112, 32, L_UI);
      // }

      fillStyle(oldFill, L_UI);
      alpha(oldAlpha, L_UI);
    }

    game.vars._fps.lastTime = game.vars._fps.currentTime - (game.vars._fps.delta % game.vars._fps.interval);

    game.vars._info.lastFrameCalled = Date.now();
    game.vars._info.render = Date.now() - game.vars._info.renderLastCalled;
    L_MAIN.ctx.drawImage(L_GAME.element, 0, 0, L_MAIN.element.width, L_MAIN.element.height);
    L_MAIN.ctx.drawImage(L_UI.element,   0, 0, L_MAIN.element.width, L_MAIN.element.height);

    // Display Console
    consoleDisplay();
  }

  if (game.vars._hash !== game.helpers.hash()) {
    game.vars._hashTime = Date.now();
    game.vars._hash = game.helpers.hash();
  }
}

function logic() {
  if (game.logicLoop !== undefined) return;

  game.logicLoop = HighResolutionTimer({duration: 1000/60, callback: timer => {
    game.vars._fps.historyTime.push(Date.now() - game.vars._fps.logicTime);
    game.vars._fps.logicTime = Date.now();
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
  }});
  game.logicLoop.run();
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function pause() {
  if (!(game.logicLoop || game.renderLoop)) return;
  console.log('pausing');
  cancelAnimationFrame(game.renderLoop);
  game.logicLoop.stop();
  game.logicLoop  = undefined;
  game.renderLoop = undefined;
}

function resume() {
  if (game.logicLoop || game.renderLoop) return;
  console.log('resuming');
  logic();
  render();
}

function queue(len) {
  let ret = [];

  ret.reset = () => {
    ret._realMin = +Infinity;
    ret._realMax = -Infinity;
  };

  ret.reset();

  ret.push = (a) => {
    if (ret.length == len) ret.shift();
    if (a < ret._realMin) ret._realMin = a;
    if (a > ret._realMax) ret._realMax = a;
    return Array.prototype.push.apply(ret, [a]);
  };

  ret.avg = () => {
    if (ret.length === 0) return NaN;
    else if (ret.length === 1) return Number(ret[0]);
    else return Number(ret.reduce((a,b)=>a+b)/ret.length);
  };

  ret.max = () => Math.max(...ret);
  ret.min = () => Math.min(...ret);
  ret.range = () => ret.max() - ret.min();

  ret.realMin = () => ret._realMin;
  ret.realMax = () => ret._realMax;

  return ret;
}

// Pause/Resume game if screen is visible
vis(() => vis() ? resume() : pause());