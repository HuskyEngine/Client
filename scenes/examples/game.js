// Init script
game.scripts.init = (cb) => {
  game.local = {
    bike: false,
    showCovers: false,
    showSolids: false,
    reflection: true,
    reflectionWaver: true,
    mapOpacity: 1,
    steps: 0,
    actions: {
      walk: {
        steps: [1,2,3],
        time: 250
      },
      run: {
        steps: [3,1,2],
        time: 125
      },
      bike: {
        steps: [1,2,3],
        time: 80
      },
      wheelie: {
        steps: [1,2],
        time: 160
      }
    },
    actionPerc: 0,
    action: "walk",
    godmode: false,
    dirs: {
      "ArrowUp": "up",
      "ArrowRight": "right",
      "ArrowDown": "down",
      "ArrowLeft": "left"
    },
    x: -6,
    y: -7,
    moving: false,
    fauxmove: false,
    walkInfo: {},
    tempX: 0,
    tempY: 0,
    dir: "ArrowDown",
    vals: {
      "ArrowUp": ['y', 1],
      "ArrowRight": ['x', -1],
      "ArrowDown": ['y', -1],
      "ArrowLeft": ['x', 1]
    }
  };

  game.local.stepCalculation = (type="walk") => {
    if (type === "wheelie") return game.local.actions[type].steps[game.local.steps % 2];
    else if (game.local.actionPerc > .2 && game.local.actionPerc < .8) return game.local.actions[type].steps[(game.local.steps % 2) + 1];
    else return game.local.actions[type].steps[0];
  };

  game.local.renderButtons = () => {
    if (!game.helpers.mobileCheck()) return;

    // Restore transparency
    alpha(game.scripts.layout._misc.transparency);

    // A button
    alpha((game.button.held.a || game.key.held.a) ? 1 : game.scripts.layout._misc.transparency);
    drawImage("buttons/a.svg", game.scripts.layout.buttons.a.x, game.scripts.layout.buttons.a.y, game.scripts.layout.buttons.a.width, game.scripts.layout.buttons.a.height);

    // B button
    alpha((game.button.held.b || game.key.held.b) ? 1 : game.scripts.layout._misc.transparency);
    drawImage("buttons/b.svg", game.scripts.layout.buttons.b.x, game.scripts.layout.buttons.b.y, game.scripts.layout.buttons.b.width, game.scripts.layout.buttons.b.height);

    // Dpad Controls
    alpha((game.button.held.up || game.key.held.ArrowUp) ? 1 : game.scripts.layout._misc.transparency);
    drawImage("buttons/up.svg", game.scripts.layout.buttons.up.x, game.scripts.layout.buttons.up.y, game.scripts.layout.buttons.up.width, game.scripts.layout.buttons.up.height);

    alpha((game.button.held.right || game.key.held.ArrowRight) ? 1 : game.scripts.layout._misc.transparency);
    drawImage("buttons/right.svg", game.scripts.layout.buttons.right.x, game.scripts.layout.buttons.right.y, game.scripts.layout.buttons.right.width, game.scripts.layout.buttons.right.height);

    alpha((game.button.held.down || game.key.held.ArrowDown) ? 1 : game.scripts.layout._misc.transparency);
    drawImage("buttons/down.svg", game.scripts.layout.buttons.down.x, game.scripts.layout.buttons.down.y, game.scripts.layout.buttons.down.width, game.scripts.layout.buttons.down.height);

    alpha((game.button.held.left || game.key.held.ArrowLeft) ? 1 : game.scripts.layout._misc.transparency);
    drawImage("buttons/left.svg", game.scripts.layout.buttons.left.x, game.scripts.layout.buttons.left.y, game.scripts.layout.buttons.left.width, game.scripts.layout.buttons.left.height);
    ////////////////

    // Restore transparency
    alpha(game.scripts.layout._misc.transparency);
  };

  game.local.keyWalk = (key) => {
    if (!game.local.moving && Object.keys(game.local.dirs).indexOf(key) !== -1) {
      game.local.dir = key;
      game.local.walkStart = Date.now()
      game.local.moving = true;

      if (!game.local.validmove()) {
        game.local.fauxmove = true;
      }
    }
  };

  game.local.buttonWalk = (button) => {
    if (!game.local.moving && Object.values(game.local.dirs).indexOf(button) !== -1) {
      game.local.dir = "Arrow" + button.slice(0, 1).toUpperCase() + button.slice(1);
      game.local.walkStart = Date.now()
      game.local.moving = true;

      if (!game.local.validmove()) {
        game.local.fauxmove = true;
      }
    }
  };

  game.local.validmove = (pos=undefined) => {
    let invalid = [51,19,736,707,549,439,455,423,422,421,437,453,454,471,470,486,487,1336,589,590,606,605,743,742,741,663,662,661,660,676,677,678,679,757,758,759,775,774,773,695,694,693,692,710,789,784,785,787,788,772,771,770,769,768,752,753,754,755,756,740,739,738,737,672,673,674,675,691,690,689,688,704,705,1288,1289,1290,1291,1292,1308,1307,1306,1305,1304,1320,1321,1322,1323,1324,1340,1339,1337,577,593,578,594,609,610,626,625,641,642,17,53,417,418,434,433,912,914,915,916,896,880,881,882,883,884,900,899,898,897,501,485,500,499,483,451,469,464,465,466,467,498,497,496,480];
    if (game.local.godmode && pos === undefined) return true;

    let next;
    if (pos === undefined) {
      pos = game.helpers.getPos();
      let nextPos = {
        x: pos.x,
        y: pos.y
      };
      nextPos[game.local.vals[game.local.dir][0]] -= game.local.vals[game.local.dir][1];
      next = game.map.src[nextPos.y-1][nextPos.x-1];

    // Manual pos, check if provided pos is valid
    } else {
      next = game.map.src[pos.y-1][pos.x-1];
    }

    return invalid.indexOf(next[1]) === -1 && invalid.indexOf(next[0]) === -1;
  };

  cb();
};

// Button Listeners
game.scripts.onTouch = (button) => {
  game.local.buttonWalk(button);
  if (button === "a") game.local.bike = !game.local.bike;
};

game.scripts.onTap = (button) => {

};

game.scripts.onHold = (button) => {
  game.local.buttonWalk(button)
};

game.scripts.onUntouch = (button) => {

};

// Keyboard listeners
game.scripts.onKeyTouch = (key) => {
  game.local.keyWalk(key);
  if (key === "a") game.local.bike = !game.local.bike;
};

game.scripts.onKeyTap = (key) => {

};

game.scripts.onKeyHold = (key) => {
  game.local.keyWalk(key);
};

game.scripts.onKeyUntouch = (key) => {

};

// Button layout
game.scripts.layout = {
   "buttons":{
      "a":{
         "x":1700,
         "y":600,
         "width":200,
         "height":200
      },
      "b":{
         "x":1500,
         "y":800,
         "width":200,
         "height":200
      },
      "up":{
         "x":340,
         "y":570,
         "width":104,
         "height":148
      },
      "right":{
         "x":454,
         "y":728,
         "width":148,
         "height":104
      },
      "down":{
         "x":340,
         "y":842,
         "width":104,
         "height":148
      },
      "left":{
         "x":182,
         "y":728,
         "width":148,
         "height":104
      },
   },
   "_misc":{
      "transparency":0.35,
      "holdDelay": 50
   }
};

// Game logic loop
game.scripts.logic = (frame) => {
  // Make sure that player isn't currently moving before changing action type
  if (game.local.actionPerc === 0) {

    // Bike (b = wheelie)
    if (game.local.bike) {
      game.local.action = (game.button.held.b || game.key.held.b) ? "wheelie" : "bike";

    // Walk (b = run)
    } else {
      game.local.action = (game.local.moving && (game.button.held.b || game.key.held.b)) ? "run" : "walk";    
    }
  }

  // Update player position after movement finishes
  if (game.local.moving) {
    let diff = Date.now() - game.local.walkStart;
    if (diff >= game.local.actions[game.local.action].time) {
      if (!game.local.fauxmove) {
        game.local[game.local.vals[game.local.dir][0]] += game.local.vals[game.local.dir][1];
        game.local.steps++;
      }
      game.local.actionPerc = 0;
      game.local.moving = false;
      game.local.fauxmove = false;
      game.local.tempX = 0;
      game.local.tempY = 0;
    }
  }
};

// Game render loop
game.scripts.render = (frame) => {
  let oldAlpha, oldFill;

  // Interpolate position of player while moving
  if (game.local.moving) {
    let diff = Date.now() - game.local.walkStart;
    game.local.actionPerc = diff/game.local.actions[game.local.action].time;

    if (!game.local.fauxmove && diff < game.local.actions[game.local.action].time) {
      game.local['temp' + game.local.vals[game.local.dir][0].toUpperCase()] = game.local.vals[game.local.dir][1] * (diff/game.local.actions[game.local.action].time)*(game.settings.tilesize*game.settings.multiplier);
    }
  }

  game.animations.clear();

  // Draw reflectables first
  let pos = game.helpers.getPos()
  for (let i = 0; i < game.map.reflections.length; i++) {
    let tile = {tile: game.map.reflections[i].tile, x: game.map.reflections[i].i*16-16+game.map.reflections[i].l, y: game.map.reflections[i].j*16-16+game.map.reflections[i].k}
    game.canvas.ctx.drawImage(game.assets.images['tilesheet.png'], (tile.tile[0] % 16) * 16, Math.floor(tile.tile[0] / 16) * 16, 16, 16, ~~-(pos.x-tile.x-16)*64+game.local.tempX, ~~-(pos.y-tile.y-9)*64+game.local.tempY, 64, 64);
    game.canvas.ctx.drawImage(game.assets.images['tilesheet.png'], (tile.tile[1] % 16) * 16, Math.floor(tile.tile[1] / 16) * 16, 16, 16, ~~-(pos.x-tile.x-16)*64+game.local.tempX, ~~-(pos.y-tile.y-9)*64+game.local.tempY, 64, 64);
  }

  // Draw reflection
  if (game.local.reflection) {
    alpha(.25);
    if (game.local.reflectionWaver) {
      drawSpriteReflection(['boy_inversed.png', game.local.action, game.local.dir.slice(5).toLowerCase(), game.local.stepCalculation(game.local.action)], 16*64, 10*64);
    } else {
      drawSprite(['boy_inversed.png', game.local.action, game.local.dir.slice(5).toLowerCase(), game.local.stepCalculation(game.local.action)], 16*64, 10*64);
    }
    alpha(1);
  }

  oldAlpha = alpha();
  alpha(game.local.mapOpacity);
  // Draw quadrants
  let size = game.settings.quadrantsize;
  for (let i = 0; i < game.map.quadrants.length; i++) {
    for (let j = 0; j < game.map.quadrants[0].length; j++) {
      game.canvas.ctx.drawImage(game.map.quadrants[j][i], 0, 0, size, size, game.settings.quadrantsize*j+game.local.x*game.settings.multiplier*game.settings.tilesize+game.local.tempX, game.settings.quadrantsize*i+game.local.y*game.settings.multiplier*game.settings.tilesize+game.local.tempY, size, size);
    }
  }
  alpha(oldAlpha);
  //drawImage('map.png', game.local.x*64+game.local.tempX, game.local.y*64+game.local.tempY, 3200, 3200);
  
  drawSprite(['boy.png', game.local.action, game.local.dir.slice(5).toLowerCase(), game.local.stepCalculation(game.local.action)], "center", "center");

  // Draw cover tiles
  if (game.local.showCovers) {
    oldAlpha = alpha();
    oldFill  = fillStyle();
    alpha(.75);
    fillStyle('black');
  }

  pos = game.helpers.getPos()
  for (let i = 0; i < game.map.cover.length; i++) {
    let tile = {tile: game.map.cover[i].tile, x: game.map.cover[i].i*16-16+game.map.cover[i].l, y: game.map.cover[i].j*16-16+game.map.cover[i].k}
    //[~~-(pos.x-tile.x-16)*64, ~~-(pos.y-tile.y-9)*64]
    if (game.local.showCovers) {
      game.canvas.ctx.fillRect(~~-(pos.x-tile.x-16)*64+game.local.tempX, ~~-(pos.y-tile.y-9)*64+game.local.tempY, 64, 64);
    } else {
      game.canvas.ctx.drawImage(game.assets.images['tilesheet.png'], (tile.tile % 16) * 16, Math.floor(tile.tile / 16) * 16, 16, 16, ~~-(pos.x-tile.x-16)*64+game.local.tempX, ~~-(pos.y-tile.y-9)*64+game.local.tempY, 64, 64);
    }
  }
  if (game.local.showCovers) {
    alpha(oldAlpha);
    fillStyle(oldFill);
  }

  // Draw solids if enabled
  if (game.local.showSolids) {

    oldAlpha = alpha();
    oldFill  = fillStyle();
    alpha(.75);
    fillStyle('red');

    let pos = game.helpers.getPos()
    for (let i = 0; i < game.map.src.length; i++) {
      for (let j = 0; j < game.map.src[0].length; j++) {
        if (!game.local.validmove({x: j+1, y: i+1})) {
          game.canvas.ctx.fillRect(~~-(pos.x-j-16)*64+game.local.tempX+64, ~~-(pos.y-i-9)*64+game.local.tempY+64, 64, 64);
        }
      }
    }

    alpha(oldAlpha);
    fillStyle(oldFill);
  }

  game.local.renderButtons();
};
