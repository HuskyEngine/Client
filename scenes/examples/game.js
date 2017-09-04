// Init script
game.scripts.init = (cb) => {
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
  game.local.renderButtons();
};
