// Init script
game.scripts.init = (cb) => {
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
      "transparency":0.35
   }
};


// Game logic loop
game.scripts.logic = (frame) => {
  if (game.vars.x === undefined) game.vars.x = 0;
  if (game.vars.y === undefined) game.vars.y = 0;
  if (game.vars.multi === undefined) game.vars.multi = 1;

  if (game.button.held.a) game.vars.multi = 2;
  else if (game.button.held.b) game.vars.multi = 4;
  else game.vars.multi = 1;

  if (game.button.held.up) game.vars.y -= game.vars.multi;
  else if (game.button.held.right) game.vars.x += game.vars.multi;
  else if (game.button.held.down) game.vars.y += game.vars.multi;
  else if (game.button.held.left) game.vars.x -= game.vars.multi;
};


// Game render loop
game.scripts.render = (frame) => {
  game.animations.clear();

  if (game.helpers.mobileCheck()) {

    // Restore transparency
    alpha(game.scripts.layout._misc.transparency);

    // A button
    alpha(game.button.held.a ? 1 : game.scripts.layout._misc.transparency);
    drawImage("buttons/a.svg", game.scripts.layout.buttons.a.x,       game.scripts.layout.buttons.a.y,       game.scripts.layout.buttons.a.width, game.scripts.layout.buttons.a.height);

    // B button
    alpha(game.button.held.b ? 1 : game.scripts.layout._misc.transparency);
    drawImage("buttons/b.svg", game.scripts.layout.buttons.b.x,       game.scripts.layout.buttons.b.y,       game.scripts.layout.buttons.b.width, game.scripts.layout.buttons.b.height);

    // Dpad Controls
    alpha(game.button.held.up ? 1 : game.scripts.layout._misc.transparency);
    drawImage("buttons/up.svg", game.scripts.layout.buttons.up.x, game.scripts.layout.buttons.up.y,    game.scripts.layout.buttons.up.width, game.scripts.layout.buttons.up.height);

    alpha(game.button.held.right ? 1 : game.scripts.layout._misc.transparency);
    drawImage("buttons/right.svg", game.scripts.layout.buttons.right.x, game.scripts.layout.buttons.right.y, game.scripts.layout.buttons.right.width, game.scripts.layout.buttons.right.height);

    alpha(game.button.held.down ? 1 : game.scripts.layout._misc.transparency);
    drawImage("buttons/down.svg", game.scripts.layout.buttons.down.x, game.scripts.layout.buttons.down.y, game.scripts.layout.buttons.down.width, game.scripts.layout.buttons.down.height);

    alpha(game.button.held.left ? 1 : game.scripts.layout._misc.transparency);
    drawImage("buttons/left.svg", game.scripts.layout.buttons.left.x,    game.scripts.layout.buttons.left.y, game.scripts.layout.buttons.left.width, game.scripts.layout.buttons.left.height);
    ////////////////

    // Restore transparency
    alpha(game.scripts.layout._misc.transparency);

  } else {

  }
};
