// Init script
game.scripts.init = (cb) => {
  game.helpers.load('examples/game');
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

};


// Game render loop
game.scripts.render = (frame) => {
  game.animations.clear();
  fillStyle('black');
  game.canvas.ctx.fillRect(0, 0, game.canvas.rwidth, game.canvas.rheight);
  fillStyle('white');
  text("Awesome game stuff here", 32, "center", "center");
};
