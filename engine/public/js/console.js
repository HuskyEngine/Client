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
        action() {},
        man: `Clear the console log.`
      },
      godmode: {
        action() {
          game.local.godmode = !game.local.godmode;
          result = game.local.godmode;
        },
        man: `Enables god mode (noclip).`
      },
      help: {
        action() {
          result = Object.keys(commands);
        },
        man: `Shows available commands.`
      },
      hideinfo: {
        action() {
            game.vars._info.showInfo = false;
            result = "true";
        },
        man: `Hides info.`
      },
      hidecovers: {
        action() {
          game.local.showCovers = false;
          result = "false";
        },
        man: `Hides covers`
      },
      hidesolids: {
        action() {
          game.local.showSolids = false;
          result = "false";
        },
        man: `Hides solids`
      },
      info: {
        action() {
          game.vars._console.log.unshift(`loadArgs: ${JSON.stringify(game.vars.loadArgs)}`);
          game.vars._console.log.unshift(`_prev:       ${game.vars._prev}`);
          game.vars._console.log.unshift(`_scene:     ${game.vars._script}`);
          result = "true";
        },
        man: `Output some useful variable values.`
      },
      load: {
        action() {
          game.helpers.load(command[1], JSON.parse(command[2] || "{}"));
          result = "Loading scene " + (command[1] || "load");
        },
        man: `Load the provided scene.`
      },
      man: {
        action() {
          if (command[1] === undefined) result = `Please provide a command whose man page you wish to lookup`;
          else if (!(command[1] in commands)) result = `Man page for ${command[1]} was not found`;
          else result = (commands[command[1]].man || `No man page available for ${command[1]}`);
        },
        man: `Shows manual page of given command if available.`
      },
      mode: {
        action() {
          if (command[1] === "mobile" || command[1] === "1") {
            game.vars._mobileCheckOverride = "mobile";
            result = "Setting game mode to mobile...";
          } else if (command[1] === "desktop" || command[1] === "2") {
            game.vars._mobileCheckOverride = "desktop";
            result = "Setting game mode to desktop...";
          } else {
            game.vars._mobileCheckOverride = null;
            result = "Resetting game mode to auto...";
          }
        },
        man: `Force game into specified mode. Accepts mobile/1, desktop/2, or any other value for automatic detection (default).`
      },
      opacity: {
        action() {
          game.local.mapOpacity = Number((command[1] || 1));
          result = Number((command[1] || 1));
        },
        man: `Set map render opacity`
      },
      showinfo: {
        action() {
          game.vars._info.showInfo = true;
          result = "true";
        },
        man: `Shows info.`
      },
      showcovers: {
        action() {
          game.local.showCovers = true;
          result = "true";
        },
        man: `Shows covers`
      },
      showsolids: {
        action() {
          game.local.showSolids = true;
          result = "true";
        },
        man: `Shows solids`
      },
      refresh: {
        action() {
          game.helpers.setTimeout(() => {
            location.reload(command[1] !== undefined);
          }, 100);
          result = command[1] !== undefined ? "Hard refreshing..." : "Refreshing...";
        },
        man: `Refreshes the page. Can provide any 2nd argument to hard refresh.`
      },
      reload: {
        action() {
          game.helpers.setTimeout(() => {
            if (game.vars._script === "error") {
              game.helpers.load(game.vars._prev);
            } else {
              game.helpers.load(game.vars._script);
            }
            game.vars._console.display = false;
          }, 100);
          result = "Reloading scene...";
        },
        man: `Reload current scene.`
      },
      reloadassets: {
        action() {
          game.helpers.setTimeout(() => {
            game.logicReady  = false;
            game.renderReady = false;

            game.helpers.loadAssets(() => {
              // Reset render and logic frame to 0
              game.renderFrame = 0;
              game.logicFrame  = 0;

              // Run init before giving logic loop green light
              game.logicReady = true;
            });

          }, 100);

          result = "Reloading assets";
        },
        man: `Reload game assets and then reload scene.`
      },
      reflection: {
        action() {
          let mode = Number((command[1] || 0));
          if (mode === 1) {
            game.local.reflection = true;
            game.local.reflectionWaver = false;
          } else if (mode === 2) {
            game.local.reflection = true;
            game.local.reflectionWaver = true;
          } else {
            game.local.reflection = false;
          }
          result = mode;
        },
        man: `Enable reflections`
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

      game.vars._console.log.unshift('└ ' + result);
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
    let val = game.settings.holdDelay;

    if (!game.vars._console.display) {
      game.helpers.setTimeout(() => {
        game.settings.holdDelay = (game.scripts.layout._misc && game.scripts.layout._misc.holdDelay !== undefined) ? game.scripts.layout._misc.holdDelay : 200;
      }, 150);
    } else {
      game.settings.holdDelay = 300;
    }
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

    game.vars._console.log.forEach((line) => {
      text(line, "24pt Arial", 0, 30+(30*++linenum));
    });

    fillStyle(oldFill);
    alpha(oldAlpha);
  }
}
