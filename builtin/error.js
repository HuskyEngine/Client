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
  text("Husky Engine encountered an error: " + game.loadArgs.type, {size: 20, font: "Arial"}, 4, 8, L_GAME);
  text(game.loadArgs.msg, {size: 18, font: "Arial"}, 6, 12, L_GAME);
};
