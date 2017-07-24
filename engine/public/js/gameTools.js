game.helpers.resize = function() {
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

    // Reset logic and render ready status
    game.logicReady  = false;
    game.renderReady = false;

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

game.helpers.loadSound = (name, path, cb) => {
  game.assets.audio[name] = new buzz.sound("audio/" + path);
  game.assets.audio[name].bind("loadstart", () => {
    cb()
  });

  game.assets.audio[name].bind("playing", () => {

  });

  game.assets.audio[name].bind("ended", () => {

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

game.helpers.loadAssets = () => {
  let images     = [];
  let sprites    = [];
  let animations = [];

  // Load image assets
  async.series([

    // Load files list
    cb => {
      $.get('assets.manifest', (files) => {
        let raw = files;
        images     = raw.images;
        sprites    = raw.sprites;
        animations = raw.animations;
        game.local.total = images.length + sprites.length + animations.length;
        cb();
      });
    },

    // Load Husky Engine logo separately
    cb => game.helpers.loadImg("huskyengine", "huskyengine.svg", () => {
      game.local.huskyLoaded = true;
      game.local.loadedFrame = game.renderFrame;
      cb();
    }),

    // Load all images
    cb => {
      async.eachLimit(images, 10, (file, loaded) => {
        game.helpers.loadImg(file, file, () => {
          game.local.fileName = file;
          game.local.current++;
          loaded();
        });
      }, cb);
    },

    // Load all sprites
    cb => {
      async.eachLimit(sprites, 10, (file, loaded) => {
        game.helpers.loadSprite(file, file, () => {
          game.local.fileName = file;
          game.local.current++;
          loaded();
        });
      }, cb);
    },

    // Load all animations
    cb => {
      async.eachLimit(animations, 10, (file, loaded) => {
        game.helpers.loadAnimation(file, file, () => {
          game.local.fileName = file;
          game.local.current++;
          loaded();
        });
      }, cb);
    },

  // Finish init
  ], () => {
    game.helpers.setTimeout(() => {
      game.local.fileName = "";
    }, 1000);
    game.local.loaded = true;
  });
};
