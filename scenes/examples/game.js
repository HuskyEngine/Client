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
    fauxSteps: 0,
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
    if (type === "wheelie") return game.local.actions[type].steps[game.local.fauxSteps % 2];
    else if (game.local.actionPerc > .2 && game.local.actionPerc < .8) return game.local.actions[type].steps[(game.local.fauxSteps % 2) + 1];
    else return game.local.actions[type].steps[0];
  };

  game.local.renderButtons = () => {
    if (!game.helpers.mobileCheck()) return;

    // Restore transparency
    alpha(game.scripts.layout._misc.transparency, L_UI);

    // A button
    alpha((game.button.held.a || game.key.held.a) ? 1 : game.scripts.layout._misc.transparency, L_UI);
    drawImage("buttons/a.svg", game.scripts.layout.buttons.a.x*L_UI.scale(), game.scripts.layout.buttons.a.y*L_UI.scale(), game.scripts.layout.buttons.a.width*L_UI.scale(), game.scripts.layout.buttons.a.height*L_UI.scale(), L_UI);

    // B button
    alpha((game.button.held.b || game.key.held.b) ? 1 : game.scripts.layout._misc.transparency, L_UI);
    drawImage("buttons/b.svg", game.scripts.layout.buttons.b.x*L_UI.scale(), game.scripts.layout.buttons.b.y*L_UI.scale(), game.scripts.layout.buttons.b.width*L_UI.scale(), game.scripts.layout.buttons.b.height*L_UI.scale(), L_UI);

    // Dpad Controls
    alpha((game.button.held.up || game.key.held.ArrowUp) ? 1 : game.scripts.layout._misc.transparency, L_UI);
    drawImage("buttons/up.svg", game.scripts.layout.buttons.up.x*L_UI.scale(), game.scripts.layout.buttons.up.y*L_UI.scale(), game.scripts.layout.buttons.up.width*L_UI.scale(), game.scripts.layout.buttons.up.height*L_UI.scale(), L_UI);

    alpha((game.button.held.right || game.key.held.ArrowRight) ? 1 : game.scripts.layout._misc.transparency, L_UI);
    drawImage("buttons/right.svg", game.scripts.layout.buttons.right.x*L_UI.scale(), game.scripts.layout.buttons.right.y*L_UI.scale(), game.scripts.layout.buttons.right.width*L_UI.scale(), game.scripts.layout.buttons.right.height*L_UI.scale(), L_UI);

    alpha((game.button.held.down || game.key.held.ArrowDown) ? 1 : game.scripts.layout._misc.transparency, L_UI);
    drawImage("buttons/down.svg", game.scripts.layout.buttons.down.x*L_UI.scale(), game.scripts.layout.buttons.down.y*L_UI.scale(), game.scripts.layout.buttons.down.width*L_UI.scale(), game.scripts.layout.buttons.down.height*L_UI.scale(), L_UI);

    alpha((game.button.held.left || game.key.held.ArrowLeft) ? 1 : game.scripts.layout._misc.transparency, L_UI);
    drawImage("buttons/left.svg", game.scripts.layout.buttons.left.x*L_UI.scale(), game.scripts.layout.buttons.left.y*L_UI.scale(), game.scripts.layout.buttons.left.width*L_UI.scale(), game.scripts.layout.buttons.left.height*L_UI.scale(), L_UI);
    ////////////////

    // Restore transparency
    alpha(game.scripts.layout._misc.transparency, L_UI);
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
      game.local.fauxSteps++;
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
  if (frame === 1) game.animations.clear();

  fillStyle('black', L_GAME);
  fillRect(0, 0, L_GAME.element.width, L_GAME.element.height);

  let oldAlpha, oldFill;

  // Interpolate position of player while moving
  if (game.local.moving) {
    let diff = Date.now() - game.local.walkStart;
    game.local.actionPerc = diff/game.local.actions[game.local.action].time;

    if (!game.local.fauxmove && diff < game.local.actions[game.local.action].time) {
      game.local['temp' + game.local.vals[game.local.dir][0].toUpperCase()] = game.local.vals[game.local.dir][1] * (diff/game.local.actions[game.local.action].time)*(game.settings.tilesize*game.settings.multiplier);
    }
  }

  game.animations.clear(L_GAME);

  // Draw reflectables first
  let pos = game.helpers.getPos()
  for (let i = 0; i < game.map.reflections.length; i++) {
    let tile = {tile: game.map.reflections[i].tile, x: game.map.reflections[i].i*16-16+game.map.reflections[i].l, y: game.map.reflections[i].j*16-16+game.map.reflections[i].k}
    drawImage('tilesheet.png', (tile.tile[0] % 16) * 16, Math.floor(tile.tile[0] / 16) * 16, 16, 16, ~~-(pos.x-tile.x-16)*64+game.local.tempX, ~~-(pos.y-tile.y-9)*64+game.local.tempY, 64, 64, L_GAME);
    drawImage('tilesheet.png', (tile.tile[1] % 16) * 16, Math.floor(tile.tile[1] / 16) * 16, 16, 16, ~~-(pos.x-tile.x-16)*64+game.local.tempX, ~~-(pos.y-tile.y-9)*64+game.local.tempY, 64, 64, L_GAME);
  }

  // Draw reflection
  if (game.local.reflection) {
    alpha(.25, L_GAME);
    if (game.local.reflectionWaver) {
      drawSpriteReflection(['boy_inversed.png', game.local.action, game.local.dir.slice(5).toLowerCase(), game.local.stepCalculation(game.local.action)], 16*64, 10*64, L_GAME);
    } else {
      drawSprite(['boy_inversed.png', game.local.action, game.local.dir.slice(5).toLowerCase(), game.local.stepCalculation(game.local.action)], 16*64, 10*64, L_GAME);
    }
    alpha(1, L_GAME);
  }

  oldAlpha = alpha(L_GAME);
  alpha(game.local.mapOpacity, L_GAME);
  // Draw quadrants
  let xquad = pos.quad[0];
  let yquad = pos.quad[1];
  let size = 256*L_GAME.scale();
  for (let i = 0; i < game.map.quadrants.length; i++) {
    for (let j = 0; j < game.map.quadrants[0].length; j++) {
      if (j >= xquad-3 && j <= xquad && i >= yquad-2 && i <= yquad) {
        //console.log(j, i, xquad, yquad, j >= xquad && j <= xquad+2 && i >= yquad && i <= yquad+2);
        //console.log(`drawImage(game.map.quadrants[${j}][${i}], 0, 0, ${size}, ${size}, ${1024*j+game.local.x*game.settings.multiplier*game.settings.tilesize+game.local.tempX}, ${1024*i+game.local.y*game.settings.multiplier*game.settings.tilesize+game.local.tempY}, 1024, 1024, L_GAME);`);
        drawImage(game.map.quadrants[j][i], 0, 0, size, size, 1024*j+game.local.x*game.settings.multiplier*game.settings.tilesize+game.local.tempX, 1024*i+game.local.y*game.settings.multiplier*game.settings.tilesize+game.local.tempY, 1024, 1024, L_GAME);
      }
    }
  }
  alpha(oldAlpha, L_GAME);
  //drawImage('map.png', game.local.x*64+game.local.tempX, game.local.y*64+game.local.tempY, 3200, 3200);
  
  drawSprite(['boy.png', game.local.action, game.local.dir.slice(5).toLowerCase(), game.local.stepCalculation(game.local.action)], "center", "center", L_GAME);

  // Draw cover tiles
  if (game.local.showCovers) {
    oldAlpha = alpha(L_GAME);
    oldFill  = fillStyle(L_GAME);
    alpha(.75, L_GAME);
    fillStyle('black', L_GAME);
  }

  pos = game.helpers.getPos()
  for (let i = 0; i < game.map.cover.length; i++) {
    let tile = {tile: game.map.cover[i].tile, x: game.map.cover[i].i*16-16+game.map.cover[i].l, y: game.map.cover[i].j*16-16+game.map.cover[i].k}
    //[~~-(pos.x-tile.x-16)*64, ~~-(pos.y-tile.y-9)*64]
    if (game.local.showCovers) {
      fillRect(~~-(pos.x-tile.x-16)*64+game.local.tempX, ~~-(pos.y-tile.y-9)*64+game.local.tempY, 64, 64, L_GAME);
    } else {
      drawImage('tilesheet.png', (tile.tile % 16) * 16, Math.floor(tile.tile / 16) * 16, 16, 16, ~~-(pos.x-tile.x-16)*64+game.local.tempX, ~~-(pos.y-tile.y-9)*64+game.local.tempY, 64, 64, L_GAME);
    }
  }
  if (game.local.showCovers) {
    alpha(oldAlpha, L_GAME);
    fillStyle(oldFill, L_GAME);
  }

  // Draw solids if enabled
  if (game.local.showSolids) {

    oldAlpha = alpha(L_GAME);
    oldFill  = fillStyle(L_GAME);
    alpha(.75, L_GAME);
    fillStyle('red', L_GAME);

    let pos = game.helpers.getPos()
    for (let i = 0; i < game.map.src.length; i++) {
      for (let j = 0; j < game.map.src[0].length; j++) {
        if (!game.local.validmove({x: j+1, y: i+1})) {
          fillRect((~~-(pos.x-j-16)*64+game.local.tempX+64) * L_GAME.scale() + "px", (~~-(pos.y-i-9)*64+game.local.tempY+64) * L_GAME.scale() + "px", 64 * L_GAME.scale() + "px", 64 * L_GAME.scale() + "px", L_GAME);
        }
      }
    }

    alpha(oldAlpha, L_GAME);
    fillStyle(oldFill, L_GAME);
  }

  game.local.renderButtons();
};
