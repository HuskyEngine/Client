function consoleHandler(key) {
  if (game.vars._console.display) {
    if (game.vars._console.history.length > 0) {
      if (key === "ArrowUp") {
        game.vars._console.content = game.vars._console.history[game.vars._console.historyIndex];
        if (game.vars._console.history[game.vars._console.historyIndex+1]) {
          game.vars._console.historyIndex++;
        }
      } else if (key === "ArrowDown") {
        game.vars._console.content = game.vars._console.history[game.vars._console.historyIndex];
        if (game.vars._console.history[game.vars._console.historyIndex-1]) {
          game.vars._console.historyIndex--;
        }
      }
    }

    if (key === "Backspace") {
      game.vars._console.content = game.vars._console.content.slice(0, -1);
      if (game.vars._console.content.length === 0) game.vars._console.match = "";

    } else if (["Escape", "Enter", "ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft", "Tab"].indexOf(key) === -1) {
      game.vars._console.content += key;

    }

    let raw = game.vars._console.content;
    let command = raw.split(' ').filter(part => part !== '').map(part => part.toLowerCase());
    let result = "command not found";
    let commands = {
      clear: {
        action() {}
      },
      help: {
        action() {
          result = Object.keys(commands);
        }
      },
      hidefps: {
        action() {
            game.vars._fps.showFPS = false;
            result = "false";
        }
      },
      info: {
        action() {
          game.vars._console.log.unshift(`loadArgs: ${JSON.stringify(game.vars.loadArgs)}`);
          game.vars._console.log.unshift(`_prev:       ${game.vars._prev}`);
          game.vars._console.log.unshift(`_scene:     ${game.vars._script}`);
          result = "true";
        }
      },
      load: {
        action() {
          game.helpers.load(command[1], JSON.parse(command[2] || "{}"));
          result = "Loading scene " + (command[1] || "load");
        }
      },
      showfps: {
        action() {
            game.vars._fps.showFPS = true;
            result = "true";
        }
      }
    };

    if (key === "Enter" && command[0].length !== 0) {
      // Reset partial matches
      game.vars._console.match = "";
      game.vars._console.log.unshift('');

      // Valid command
      if (Object.keys(commands).indexOf(command[0]) !== -1) {
        commands[command[0]].action();
        game.vars._console.historyIndex = 0;
      }

      game.vars._console.log.unshift('└ result: ' + result);
      game.vars._console.log.unshift(raw);
      game.vars._console.history.unshift(raw);
      game.vars._console.content = "";

      if (raw === "clear") game.vars._console.log = [];

    } else if (key !== "Escape") {

      // Partial matches
      let matches = Object.keys(commands).filter(cmd => cmd.match(new RegExp('^' + raw, 'i')));
      if (command[0] && matches.length > 0) {

        if (key === "Tab") {
          game.vars._console.content = matches[0];
          game.vars._console.match = "";
        } else {
          game.vars._console.match = matches[0].slice(command[0].length);
        }
      } else {
        game.vars._console.match = "";
      }
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
    let content = "Husky Engine v0.0.1 > " + game.vars._console.content;
    text(content, "24pt Arial", 0, 30+(30*linenum));

    // Show partial match
    if (game.vars._console.match !== "") {
      fillStyle('#AAA');
      text(game.vars._console.match, "24pt Arial", game.canvas.ctx.measureText(content).width, 30+(30*linenum));
      fillStyle('white');
    }
    //game.vars._console.match
    //(game.vars._console.blink ? "|" : "")
    game.vars._console.log.forEach((line) => {
      text(line, "24pt Arial", 0, 30+(30*++linenum));
    });

    fillStyle(oldFill);
    alpha(oldAlpha);
  }
}
