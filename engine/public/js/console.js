function consoleHandler(key) {
  // Type commands into console
  if (game.vars._console.display) {
    if (key === "Backspace") {
      game.vars._console.content = game.vars._console.content.slice(0, -1);
    } else if (["Escape", "Enter"].indexOf(key) === -1) {
      game.vars._console.content += key;
    } else if (key === "Enter") {
      let command = game.vars._console.content;
      game.vars._console.log.unshift(command);
      game.vars._console.content = "";

      if (command === "clear") game.vars._console.log = [];
      else game.vars._console.log.unshift(eval(command));
    }
  }

  // Toggle console
  if (key === "Escape") {
    game.vars._console.display = !game.vars._console.display;
  }
}

function consoleDisplay() {
  if (game.vars._console.display) {
    let oldAlpha = alpha();
    let oldFill  = fillStyle();

    alpha(0.5);
    fillStyle('black');
    game.canvas.ctx.fillRect(0, 0, game.canvas.rwidth, game.canvas.rheight);
    fillStyle('white');
    alpha(1);

    let linenum = 0;
    text("Husky Engine v0.0.1 > " + game.vars._console.content + (game.vars._console.blink ? "_" : ""), "24pt Arial", 0, 30+(30*linenum++));
    game.vars._console.log.forEach((line) => {
      text(line, "24pt Arial", 0, 30+(30*linenum++));
    });

    fillStyle(oldFill);
    alpha(oldAlpha);
  }
}
