game.helpers.resize = function() {
  game.vars._hashTime = Date.now(); // Force update of render loop
  if (!game.helpers.mobileCheck()) {
    let width  = Math.max(window.innerWidth*.8, 512);
    let height = (width/16)*9;

    if (height > window.innerHeight) {
      height = window.innerHeight;
      width = (height/9)*16;
    }

    // Minimum size of 512 x 288
    width  = Math.max(width, 512);
    height = Math.max(height, 288);

    if (window.innerWidth < 512) {
      $('#canvas')
        .css('margin-left', "0px");
    } else {
      $('#canvas')
        .css('margin-left', (window.innerWidth-width)/2 + "px");
    }

    if (window.innerHeight < 288) {
      $('#canvas')
        .css('margin-top', "0px");
    } else {
      $('#canvas')
        .css('margin-top', (window.innerHeight-height)/2 + "px");
    }
    
    $('#canvas')
      .css('width',   width  + "px")
      .css('height',  height + "px");

  // Mobile fills entire screen
  } else {
    $('#canvas')
      .css('margin-top', "0px")
      .css('margin-left', "0px")
      .css('width',   window.innerWidth + "px")
      .css('height',  window.innerHeight + "px");
  }

  game.canvas.mult.width  = window.innerWidth/2048;
  game.canvas.mult.height = window.innerHeight/1152;

  if (game.helpers.mobileCheck() && window.innerHeight > window.innerWidth) {

    $('#canvas').hide();
    $('#landscape').show();

  } else {

    $('#canvas').show();
    $('#landscape').hide();
  }

  if (L_MAIN !== undefined) {
    L_MAIN.element.width  = ~~L_MAIN.element.style.width.slice(0, -2);
    L_MAIN.element.height  = ~~L_MAIN.element.style.height.slice(0, -2);
  }

  //L_MAIN.scale(window.innerWidth/2048)
};

game.helpers.mobileCheck = function() {
  if (game.vars._mobileCheckOverride === "mobile") return true;
  else if (game.vars._mobileCheckOverride === "desktop") return false;
  else {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }
};

game.helpers.load = (name, args={}) => {
  window.cancelAnimationFrame(game.renderLoop);
  // Reset logic and render ready status while loading new scene
  game.logicReady  = false;
  game.renderReady = false;

  if (name === undefined) name = "load"; // Special loading case
  if (name === "error" && args.type === undefined) args.type = "UNKNOWN_ERROR";

  // Check to see if this is a valid scene before moving on
  $.ajax({
    url  : `scenes/${name}.js`,
    type : 'head',
  }).always((a, b, c) => {
    if (b === "nocontent") {
      valid();
    } else {
      invalid();
    }
  });

  function valid() {
    // Reset local vars
    game.local = {};

    // Update prev/current script names
    game.vars._prev   = game.vars._script;
    game.vars._script = name;

    // Save provided args
    game.loadArgs = args;

    // Remove old intervals/timeouts
    game.intervals.forEach((interval) => {
      clearInterval(interval);
    });

    game.timeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });

    // Clear all layers and scopes
    game.animations.clear(L_GAME);
    game.animations.clear(L_UI);
    game.animations.clear(L_MAIN);

    // Remove old button events
    game.ee.removeListener('touch',   game.scripts.onTouch);
    game.ee.removeListener('tap',     game.scripts.onTap);
    game.ee.removeListener('hold',    game.scripts.onHold);
    game.ee.removeListener('untouch', game.scripts.onUntouch);

    // Remove old key events
    game.ee.removeListener('keyTouch',   game.scripts.onKeyTouch);
    game.ee.removeListener('keyTap',     game.scripts.onKeyTap);
    game.ee.removeListener('keyHold',    game.scripts.onKeyHold);
    game.ee.removeListener('keyUntouch', game.scripts.onKeyUntouch);

    // Reset scripts in case user doesn't provide one
    resetScripts();

    // Load in new script
    let _script = document.createElement('script');
    $('#script').replaceWith(_script);
    _script.onload = () => {
      scriptLoaded();
    };
    _script.id  = "script";
    _script.src = `scenes/${name}.js`;

    function scriptLoaded() {

      // Add new event listeners
      ["touch", "tap", "hold", "untouch", "keyTouch", "keyTap", "keyHold", "keyUntouch"].forEach((event) => {
        addEvent(event);
      });

      // Get settings
      game.settings.holdDelay = (game.scripts.layout._misc && game.scripts.layout._misc.holdDelay !== undefined) ? game.scripts.layout._misc.holdDelay : 200;

      // Update button names
      try {
        game.button.names = Object.keys(game.scripts.layout.buttons).filter(key => key !== "_misc");
      } catch(e) {
        game.button.names = [];
      }

      // Reset render and logic frame to 0
      game.renderFrame = 0;
      game.logicFrame  = 0;

      // Run init before giving logic loop green light
      game.scripts.init(() => {
        game.logicReady = true;
      });

      function addEvent(eventName) {
        // if is an array, then already has events
        if (!Array.isArray(game.ee._events["on" + eventName.slice(0, 1).toUpperCase() + eventName.slice(1)])) {
          game.ee.on(eventName, game.scripts["on" + eventName.slice(0, 1).toUpperCase() + eventName.slice(1)]);
        }
      }
    }
  }

  function invalid() {
    game.helpers.load('error', {type: "SCENE_NOT_FOUND", msg: `Attempt to load scene "${name}" failed.`});
  }

  function resetScripts() {
    game.scripts = {
      init(cb) {},
      onTouch(button) {},
      onTap(button) {},
      onHold(button) {},
      onUntouch(button) {},
      onKeyTouch(key) {},
      onKeyTap(key) {},
      onKeyHold(key) {},
      onKeyUntouch(key) {},
      layout: {},
      logic(frame) {},
      render(frame) {}
    };
  }
};

game.helpers.loadImg = (name, path, cb) => {
  game.assets.images[name] = new Image();
  game.assets.images[name].src = "img/" + path;
  game.assets.images[name].onload = () => cb();
  game.assets.images[name].onerror = () => {
    game.helpers.load('error', {type: "IMAGE_NOT_FOUND", msg: `Error loading image "${name}"(${path}) failed.`});
  };
};

game.helpers.loadSprite = (name, path, cb) => {
  game.assets.sprites[name] = new Image();
  game.assets.sprites[name].src = "sprites/" + path;
  game.assets.sprites[name].onload = () => loadSpriteInfo(name, cb);
  game.assets.sprites[name].onerror = () => {
    game.helpers.load('error', {type: "SPRITE_NOT_FOUND", msg: `Error loading sprite "${name}"(${path})`});
  };

  function loadSpriteInfo(name, cb) {
    $.get(`sprites/${name}.json`)
    .done((data) => {
      game.assets.sprites[name].info = data;
      cb();
    }).fail((data) => {
      game.helpers.load('error', {type: "SPRITE_INFO_NOT_FOUND", msg: `Error loading sprite info "${name}"(${path})`});
    });
  }
};

game.helpers.loadAnimation = (name, path, cb) => {
  game.assets.animations[name] = new Image();
  game.assets.animations[name].src = "animations/" + path;
  game.assets.animations[name].onload = () => loadAnimationInfo(name, cb);
  game.assets.animations[name].onerror = () => {
    game.helpers.load('error', {type: "ANIMATION_NOT_FOUND", msg: `Error loading animation "${name}"(${path})`});
  };

  function loadAnimationInfo(name, cb) {
    $.get(`animations/${name}.json`)
    .done((data) => {
      game.assets.animations[name].info = data;
      cb();
    }).fail((data) => {
      game.helpers.load('error', {type: "ANIMATION_INFO_NOT_FOUND", msg: `Error loading animation info "${name}"(${path})`});
    });
  }
};

game.helpers.loadTilesheet = (name, path, cb) => {
  game.assets.tilesheets[name] = new Image();
  game.assets.tilesheets[name].src = "tilesheets/" + path;
  game.assets.tilesheets[name].onload = () => loadTilesheetInfo(name, cb);
  game.assets.tilesheets[name].onerror = () => {
    game.helpers.load('error', {type: "TILESHEET_NOT_FOUND", msg: `Error loading tilesheet "${name}"(${path})`});
  };

  function loadTilesheetInfo(name, cb) {
    $.get(`tilesheets/${name}.json`)
    .done((data) => {
      game.assets.tilesheets[name].info = data;
      cb();
    }).fail((data) => {
      game.helpers.load('error', {type: "TILESHEET_INFO_NOT_FOUND", msg: `Error loading tilesheet info "${name}"(${path})`});
    });
  }
};

game.helpers.loadSound = (name, path, cb) => {
  game.assets.sounds[name] = new buzz.sound("sounds/" + path);
  game.assets.sounds[name].bind("loadstart", () => {
    cb()
  });

  game.assets.sounds[name].bind("playing", () => {

  });

  game.assets.sounds[name].bind("ended", () => {

  });
};

game.helpers.updateButtons = (touches, end = false) => {
  let info = [];
  let affected = [];

  // Update status for all touches
  Array.prototype.slice.call(touches.changedTouches).forEach(touch => {
    let buttonName = undefined;
    // convert touch into coors object
    touch = {
      id: touch.identifier + 1, // Some browsers use zero-indexed identifiers. Make value+1 to ensure truthiness.
      x: touch.clientX - game.canvas.rect.left,
      y: touch.clientY - game.canvas.rect.top,
      type: end ? "untouch" : "touch" 
    };

    // Apply multiplier
    touch.x /= game.canvas.mult.width;
    touch.y /= game.canvas.mult.height;

    // Check each button to see if it is active
    game.button.names.forEach(button => {
      if (touch.x >= game.scripts.layout.buttons[button].x &&
          touch.x <= game.scripts.layout.buttons[button].x + game.scripts.layout.buttons[button].width &&
          touch.y >= game.scripts.layout.buttons[button].y &&
          touch.y <= game.scripts.layout.buttons[button].y + game.scripts.layout.buttons[button].height)
      {

        // Save button info for touch event
        if (touch.type === "touch" && game.button.data[button] === undefined) {
          game.button.data[button] = {
            start: Date.now(),
            touched: false,
            touch,
            button
          };
        }

        affected.push(button);
        info.push({id: touch.id, name: button, type: touch.type});
        buttonName = button;
      }
    });

    // Didn't touch valid button, check to see if we can remove any touch identifiers
    if (buttonName === undefined) {
      for (let i = 0; i < game.button.names.length; i++) {
        if (game.button.held[game.button.names[i]] === touch.id) {
          game.button.held[game.button.names[i]] = undefined;

          if (Date.now() - game.button.data[game.button.names[i]].start < game.settings.holdDelay) {
            game.ee.emit('hold', game.button.names[i]);
          }

          delete game.button.data[game.button.names[i]];

          game.ee.emit('untouch', game.button.names[i]);
        }
      }
    }
  });

  // Update all affected buttons
  info.forEach(button => {
    if (button.type === "touch") {
      for (let i = 0; i < Object.keys(game.button.held).length; i++) {
        if (game.button.held[Object.keys(game.button.held)[i]] === button.id) {
          game.button.held[Object.keys(game.button.held)[i]] = undefined;
        }
      }
      game.button.held[button.name] = button.id

    } else {
      game.button.held[button.name] = undefined;

      if (Date.now() - game.button.data[button.name].start < game.settings.holdDelay) {
        game.ee.emit('tap', button.name);
      }

      delete game.button.data[button.name];

      game.ee.emit('untouch', button.name);
    }
  });
};

game.helpers.updateKeys = (event, end = false) => {
  // Only accept keys below
  if (["a","b","c","d","e","f","g","h","i","j",
       "k","l","m","n","o","p","q","r","s","t",
       "u","v","w","x","y","z","A","B","C","D",
       "E","F","G","H","I","J","K","L","M","N",
       "O","P","Q","R","S","T","U","V","W","X",
       "Y","Z","`","1","2","3","4","5","6","7",
       "8","9","0","-","=","~","!","@","#","$",
       "%","^","&","*","(",")","_","+","[","]",
       "\\","{","}","|",";","'",":","\"",",",".",
       "/","<",">","?","'"," ","Backspace",
       "Escape","Enter","ArrowUp","ArrowRight",
       "ArrowDown","ArrowLeft","Tab"].indexOf(event.key) === -1) return;

  let info = [];
  let affected = [];

  if (game.key.data[event.key] === undefined) {
    game.key.data[event.key] = {
      start: Date.now(),
      touched: false,
      event,
      key: event.key
    };
  }

  affected.push(event.key);
  info.push({name: event.key, type: end});

  // Update all affected buttons
  info.forEach(key => {
    if (end && Date.now() - game.key.data[key.name].start < game.settings.holdDelay) {
      game.ee.emit('keyTap', key.name);
    }

    if (end) {
      if (key.name.length === 1) {
        delete game.key.data[key.name.toUpperCase()];
        delete game.key.data[key.name.toLowerCase()];
        game.ee.emit('keyUntouch', key.name.toUpperCase());
        game.ee.emit('keyUntouch', key.name.toLowerCase());
      } else {
        delete game.key.data[key.name];
        game.ee.emit('keyUntouch', key.name);
      }
    }
  });

  // Save time
  if (end) delete game.key.held[event.key];
  else game.key.held[event.key] = Date.now();
};

game.helpers.setInterval = (func, delay=0) => {
  game.intervals.push(setInterval(func, delay));
};

game.helpers.setTimeout = (func, delay=0) => {
  game.timeouts.push(setTimeout(func, delay));
};

game.helpers.loadAssets = (done=undefined) => {
  let images     = [];
  let sprites    = [];
  let animations = [];
  let tilesheets = [];

  // Load image assets
  async.series([

    // Load files list
    cb => {
      $.get('assets.manifest', (files) => {
        let raw = files;
        images     = raw.images;
        sprites    = raw.sprites;
        animations = raw.animations;
        tilesheets = raw.tilesheets;
        game.local.totalFiles = images.length + sprites.length + animations.length + tilesheets.length;
        cb();
      });
    },

    // Load Husky Engine logo separately
    cb => game.helpers.loadImg("huskyengine", "huskyengine.svg", () => {
      game.local.huskyLoaded = true;
      game.local.loadedFrame = game.renderFrame;
      game.local.loadedTime  = Date.now();
      cb();
    }),

    // Load all images
    cb => {
      async.eachLimit(images, 5, (file, loaded) => {
        game.helpers.loadImg(file, file, () => {
          game.local.fileName = file;
          game.local.filesLoaded++;
          loaded();
        });
      }, cb);
    },

    // Load all sprites
    cb => {
      async.eachLimit(sprites, 5, (file, loaded) => {
        game.helpers.loadSprite(file, file, () => {
          game.local.fileName = file;
          game.local.filesLoaded++;
          loaded();
        });
      }, cb);
    },

    // Load all animations
    cb => {
      async.eachLimit(animations, 5, (file, loaded) => {
        game.helpers.loadAnimation(file, file, () => {
          game.local.fileName = file;
          game.local.filesLoaded++;
          loaded();
        });
      }, cb);
    },

    // Load all tilesheets
    cb => {
      async.eachLimit(tilesheets, 5, (file, loaded) => {
        game.helpers.loadTilesheet(file, file, () => {
          game.local.fileName = file;
          game.local.filesLoaded++;
          loaded();
        });
      }, cb);
    },

  // Finish init
  ], () => {
    if (done !== undefined) done();
  });
};

game.helpers.loadMap = (map, cb=()=>{}) => {
  delete game.map;
  game.map = {
    name: null,
    src:  null,
    grid: [],
    quadrants: [],
    reflections: [],
    cover: [],
    coverTiles: [625, 577, 593, 609, 608, 592, 533, 560, 561, 570, 571, 586, 587, 568, 569, 584, 585, 864, 865, 866, 867, 868, 644, 645, 646, 647, 725, 726, 727, 720, 721, 722, 723, 724, 656, 657, 658, 659, 1272, 1273, 1274, 1275, 1276]
  };
  game.map.name = map;
  $.get(`maps/${map}.json`)
  .done((data) => {
    game.map.src = data;
    game.map.grid = game.helpers.gridify();
    game.helpers.generateQuadrants(() => {
      cb();
    });
  })
  .fail((data) => {
    game.helpers.load('error', {type: "MAP_NOT_FOUND", msg: `Attempt to load map "${map}" failed.`});
  });
};

// Generates quadrant matrix to write map src to
game.helpers.gridify = () => {
  let tilesper = 16;

  // Get dimensions of map source
  let width = game.map.src[0].length;
  let height = game.map.src.length;

  // Calculate how many matrices we will have
  let widthGrids = Math.ceil(width/tilesper);
  let heightGrids = Math.ceil(height/tilesper);
  let grids = [];

  // Calculate the areas of the matrix to slice
  for (let i = 0; i < widthGrids; i++) {
    grids[i] = [];

    for (let j = 0; j < heightGrids; j++) {
      grids[i][j] = [[j*tilesper, i*tilesper], [(j+1)*tilesper, (i+1)*tilesper]];
    }
  }

  // Actually slice using calculations from above loop
  let sections = [];
  for (let i = 0; i < grids.length; i++) {
    sections[i] = [];

    for (let j = 0; j < grids[0].length; j++) {
      // Make a quadrant from 0,0 to widthGrids,heightGrids
      sections[i][j] = game.map.src.slice(grids[i][j][0][0], grids[i][j][1][0]).map((grid) => grid.slice(grids[i][j][0][1], grids[i][j][1][1]));
    }
  }

  return sections;
};

game.helpers.generateQuadrants = (done) => {
  let tilesper = 16;

  for (let i = 0; i < game.map.grid.length; i++) {
    game.map.quadrants[i] = [];
    for (let j = 0; j < game.map.grid[0].length; j++) {

      // Create new Canvas offscreen
      game.map.quadrants[i][j] = document.createElement("canvas");
      game.map.quadrants[i][j].width = 256
      game.map.quadrants[i][j].height = 256
      game.map.quadrants[i][j].style.width = 256 + "px"
      game.map.quadrants[i][j].style.height = 256 + "px"
      let grid = game.map.quadrants[i][j];
      let gridContext = grid.getContext('2d');
      grid.ctx = gridContext;
      gridContext.imageSmoothingEnabled = false;

      let slice = game.map.grid[i][j];
      for (let k = 0; k < slice.length; k++) {
        for (let l = 0; l < slice[0].length; l++) {
          let tile = slice[k][l]
          if (game.local.reflection === false || [421,422,423,439,486,454,487,439,437,453,454,455,471,422,470,438,544,545,546,528,529,530,512,513,514].indexOf(tile[1]) === -1) {
            drawTile('default.png', (tile[0] % 16) * 16, Math.floor(tile[0] / 16) * 16, 16, 16, l*16, k*16, 16, 16, grid);
            drawTile('default.png', (tile[1] % 16) * 16, Math.floor(tile[1] / 16) * 16, 16, 16, l*16, k*16, 16, 16, grid);
          } else {
            game.map.reflections.push({i: i+1, j: j+1, l: l+1, k: k+1, tile: tile});
          }

          if (game.map.coverTiles.indexOf(tile[1]) !== -1) {
            game.map.cover.push({i: i+1, j: j+1, l: l+1, k: k+1, tile: tile[1]});
          }
        }
      }
      if (i === game.map.grid.length-1 && j === game.map.grid.length-1) {
        done();
      }
    }
  }
}

game.helpers.getPos = () => {
  let x = (-game.local.x+17 || 0);
  let y = (-game.local.y+10 || 0);
  let dir = (game.local.dirs && game.local.dir) ? game.local.dirs[game.local.dir] : "";

  let xquad = Math.ceil((x * game.settings.tilesize*game.settings.multiplier) / game.settings.quadrantsize);
  let yquad = Math.ceil((y * game.settings.tilesize*game.settings.multiplier) / game.settings.quadrantsize)
  return {
    x,
    y,
    dir,
    quad: [
      xquad,
      yquad,
      x - (xquad-1)*(game.settings.quadrantsize/(game.settings.tilesize*game.settings.multiplier)),
      y - (yquad-1)*(game.settings.quadrantsize/(game.settings.tilesize*game.settings.multiplier))
    ]
  };
};

game.helpers.getBounds = () => {
  let pos = game.helpers.getPos();
  return {
    x1: pos.x-16,
    y1: pos.y-9,
    x2: pos.x+15,
    y2: pos.y+8
  };
};

game.helpers.quadToCoord = (quad) => {
  let x = (quad[0]-1)*16+quad[2];
  let y = (quad[1]-1)*16+quad[3];
  return {
    x,
    y
  };
};

game.helpers.coordToQuad = (coord) => {
  let quad_x = Math.floor(coord[0]/16)+1;
  let x = coord[0]%16;
  let quad_y = Math.floor(coord[1]/16)+1;
  let y = coord[1]%16;
  return [quad_x, quad_y, x, y];
};

game.helpers.hash = () => {
  //return md5(JSON.stringify(_.assign(game.local, game.vars._console, {_rand: [game.vars.rand0, game.vars.rand1, game.vars.rand2, game.vars.rand3, game.vars.rand4]})));
  //return md5(JSON.stringify(game.local));
  return md5(JSON.stringify(_.assign(game.local, game.vars._console)));
};

game.helpers.scope = (name, width=2048, height=1152) => {
  if (game.scopes[name] !== undefined) return game.scopes[name];

  let scope = {
    ctx:     null,
    element: document.createElement("canvas"),
    rect:    null
  };

  scope.element.width  = width;
  scope.element.height = height;
  scope.ctx   = scope.element.getContext('2d');
  scope.ctx.imageSmoothingEnabled = false;
  scope.rect  = scope.element.getBoundingClientRect();
  scope.name  = name;

  game.scopes[name] = scope;
  return scope;
};

game.helpers.renderControls = () => {
  let L_CONTROLS = game.helpers.scope('controls');
  let hash = md5(JSON.stringify(_.assign(game.button.held, game.key.held)));
  if (hash === game.vars._controlsHash) return;

  game.vars._controlsHash = hash;

  game.animations.clear(L_CONTROLS);

  // Restore transparency
  alpha(0.35, L_CONTROLS);

  // A button
  alpha((game.button.held.a || game.key.held.a) ? 1 : 0.35, L_CONTROLS);
  drawImage("buttons/a.svg", 1700, 600, 200, 200, L_CONTROLS);

  // B button
  alpha((game.button.held.b || game.key.held.b) ? 1 : 0.35, L_CONTROLS);
  drawImage("buttons/b.svg", 1500, 800, 200, 200, L_CONTROLS);

  // Dpad Controls
  alpha((game.button.held.up || game.key.held.ArrowUp) ? 1 : 0.35, L_CONTROLS);
  drawImage("buttons/up.svg", 340, 570, 104, 148, L_CONTROLS);

  alpha((game.button.held.right || game.key.held.ArrowRight) ? 1 : 0.35, L_CONTROLS);
  drawImage("buttons/right.svg", 454, 728, 148, 104, L_CONTROLS);

  alpha((game.button.held.down || game.key.held.ArrowDown) ? 1 : 0.35, L_CONTROLS);
  drawImage("buttons/down.svg", 340, 842, 104, 148, L_CONTROLS);

  alpha((game.button.held.left || game.key.held.ArrowLeft) ? 1 : 0.35, L_CONTROLS);
  drawImage("buttons/left.svg", 182, 728, 148, 104, L_CONTROLS);

  // Restore transparency
  alpha(0.35, L_CONTROLS);
};
