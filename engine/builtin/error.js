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

};


// Game logic loop
game.scripts.logic = (frame) => {

};


// Game render loop
game.scripts.render = (frame) => {
  fillStyle("red", L_GAME);
  fillRect(0, 0, 100, 100, L_GAME);
  fillStyle("white", L_GAME);
  text("Husky Engine encountered an error: " + game.loadArgs.type, "32pt Arial", 4.883, 8.681, L_GAME);
  text(game.loadArgs.msg, "32pt Arial", 6.104, 13.021, L_GAME);
};
