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
  fillStyle('black', L_GAME);
  fillRect(0, 0, L_GAME.element.width, L_GAME.element.height, L_GAME);
  fillStyle('white', L_GAME);
  text("Awesome game stuff here", 32, "center", "center", L_GAME);
};
