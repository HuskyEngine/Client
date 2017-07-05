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
  game.animations.clear();
  fillStyle("red");
  game.canvas.ctx.fillRect(0, 0, game.canvas.rwidth, game.canvas.rheight);
  fillStyle("white");
  text("Husky Engine encountered an error: " + game.loadArgs.type, "32pt Arial", "100", "100");
  text(game.loadArgs.msg, "32pt Arial", "125", 150);
};
