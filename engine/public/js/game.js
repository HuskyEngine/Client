// Game namescape object
let game = {

  // Hold all game assets
  assets: {
    animations: {},
    sprites:    {},
    audio:      {},
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

  // Main game canvas
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
    rwidth:  2048,
    rheight: 1152
  },

  // Helper functions
  helpers:     {},

  // Holds setIntervals/timeouts (automatically purged on helpers.load)
  intervals:   [],
  timeouts:    [],

  // Holds arguments passed into currently loaded scene
  loadArgs:    {},

  // Logic loop
  logicFrame:  0,
  logicLoop:   null,
  logicReady:  false,

  // Render loop
  renderFrame: 0,
  renderLoop:  null,
  renderReady: false,

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

    // FPS counter
    _fps: {
      showFPS: true,
      rate: 0,
      fps: 0,
      lastCalled: Date.now()
    },

    // Sim/Network info
    _info: {
      showInfo: true,
      sim: 0,
      render: 0,
      simLastCalled: Date.now(),
      renderLastCalled: Date.now()
    },

    _console: {
      blink: false,
      content: "",
      enabled: true,
      display: false,
      history: [],
      log: [],
      historyIndex: 0,
      match: ""
    },
    _mobileCheckOverride: null

  },

  // Local vars for a scene (automatically purged on helpers.load)
  local: {}
};

$.get('config', (data) => {
  game.vars.config = data;
  game.vars.defaultFont = data.defaultFont;
  game.vars._fps.showFPS = data.debug;
});

$(() => {
  // Remove 300ms delay on mobile devices
  FastClick.attach(document.body);

  // TODO: Prevent google chrome pull down to refresh
  // Don't allow scrolling on mobile
  $(document).bind('touchmove', false);

  // Set up main canvas references
  game.canvas.element = $("#canvas")[0];
  game.canvas.ctx     = game.canvas.element.getContext('2d');
  game.canvas.rect    = game.canvas.element.getBoundingClientRect();

  // Keep things pixelated
  game.canvas.ctx.imageSmoothingEnabled = false;

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

  // Calculate FPS
  if (game.renderFrame % 60 === 0) {
    game.vars._fps.fps = (60*1000)/(Date.now() - game.vars._fps.lastCalled);
    game.vars._fps.lastCalled = Date.now();
  }

  // Pass in current frame for timing logic
  game.scripts.render(++game.renderFrame);
  game.renderLoop = requestAnimationFrame(render);

  // Display FPS
  if (game.vars._fps.showFPS) {
    let oldAlpha = alpha();
    let oldFill  = fillStyle();
    
    alpha(1);
    fillStyle('white');
    game.canvas.ctx.fillRect(0, 0, 200, 35);
    game.canvas.ctx.fillRect(0, 0, 200, 65);
    game.canvas.ctx.fillRect(0, 0, 200, 95);
    fillStyle('black');

    let fps = game.vars._fps.fps.toFixed(1);
    let sim = game.vars._info.sim;
    let ren = game.vars._info.render;
    //if (sim <= 1) sim = "<= 1";
    //if (ren <= 1) ren = "<= 1";

    if (fps < (game.vars._fps.rate - game.vars._fps.rate * .05)) fillStyle('orange');
    if (fps < (game.vars._fps.rate - game.vars._fps.rate * .15)) fillStyle('red');
    text("fps:  " + fps, "24pt Arial", 0, 30);
    fillStyle('black');

    if (sim > 1000/game.vars._fps.rate) fillStyle('red');
    text("sim: " + sim + " ms", "24pt Arial", 0, 60);
    fillStyle('black');

    if (ren > 1000/game.vars._fps.rate) fillStyle('red');
    text("ren: " + ren + " ms", "24pt Arial", 0, 90);
    fillStyle('black');

    fillStyle(oldFill);
    alpha(oldAlpha);
  }

  // Display Console
  consoleDisplay();

  game.vars._info.render = Date.now() - game.vars._info.renderLastCalled;
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

  game.vars._console.blink = (Date.now()/100) % 10 > 5;

  game.vars._info.sim = Date.now() - game.vars._info.simLastCalled;
}, 1000/60);
