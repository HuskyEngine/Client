// Init script
game.scripts.init = (cb) => {
  // Default input name
  if (game.loadArgs.name === undefined) game.loadArgs.name = "input";

  // Set global var called game.vars._inputNAME to hold input
  if (game.vars["_input" + game.loadArgs.name] === undefined) {
    game.vars["_input" + game.loadArgs.name] = "";
  }

  // local vars for mode and password timeout
  if (game.local.mode === undefined) {
    game.local.mode = "lower";
  }

  if (game.local.passwordTimeout === undefined) {
    game.local.passwordTimeout = 0;
  }

  cb();
};

// Button Listeners
game.scripts.onTouch = (button) => {
  let char = button;
  if (char === "space") char = ' ';

  if (char === "<-") {
    game.vars["_input" + game.loadArgs.name] = game.vars["_input" + game.loadArgs.name].slice(0, -1);
  } else if (char === "mode") {
    if (game.local.mode === "upper") {
      game.local.mode = "lower";
    } else {
      game.local.mode = "upper";
    }
  } else if (char === "123") {
    if (game.local.mode === "lower") {
      game.local.mode = "lowerSpecial";
    } else if (game.local.mode === "higher") {
      game.local.mode = "lowerSpecial";
    } else if (game.local.mode === "upper") {
      game.local.mode = "lowerSpecial";
    } else {
      game.local.mode = "lower";
    }
  } else {

    if (char !== ' ' && isNaN(char) && game.local.mode === "upper") {
      char = String.fromCharCode(char.charCodeAt()-32);
    }
    if (button === "done") return;
    if (game.vars["_input" + game.loadArgs.name].length >= game.loadArgs.maxlen) return;
    game.vars["_input" + game.loadArgs.name] += char;
    game.local.passwordTimeout = Date.now();
  }


};

game.scripts.onTap = (button) => {

};

game.scripts.onHold = (button) => {
  let char = button;
  if (char === "space") char = ' ';

  if (char === "<-") {
    game.vars["_input" + game.loadArgs.name] = game.vars["_input" + game.loadArgs.name].slice(0, -1);
  } else {
    if (char !== ' ' && isNaN(char) && game.local.mode === "upper") {
      char = String.fromCharCode(char.charCodeAt()-32);
    }
    if (button === "done") return;
    if (game.vars["_input" + game.loadArgs.name].length >= game.loadArgs.maxlen) return;
    game.vars["_input" + game.loadArgs.name] += char;
    game.local.passwordTimeout = Date.now();
  }

};

game.scripts.onUntouch = (button) => {
  if (button === "done") {
    game.helpers.load(game.vars._prev);
  }

};

// Keyboard listeners
game.scripts.onKeyTouch = (key) => {
  let char = key;
  if (char === "space") char = ' ';

  if (char === "Backspace") {
    game.vars["_input" + game.loadArgs.name] = game.vars["_input" + game.loadArgs.name].slice(0, -1);
  } else {
    if (key === "Enter") return;
    if (game.vars["_input" + game.loadArgs.name].length >= game.loadArgs.maxlen) return;
    game.vars["_input" + game.loadArgs.name] += char;
    game.local.passwordTimeout = Date.now();
  }
};

game.scripts.onKeyTap = (key) => {

};

game.scripts.onKeyHold = (key) => {
  if (key === "Enter") {
    game.helpers.load(game.vars._prev);
  }
};

game.scripts.onKeyUntouch = (key) => {

};


// Button layout
game.scripts.layout = {
  buttons: {
    "1":{
      "x":21.687,
      "y":390,
      "width":180,
      "height":160
    },
    "2":{
      "x":226.482,
      "y":390,
      "width":180,
      "height":160
    },
    "3":{
      "x":431.283,
      "y":390,
      "width":180,
      "height":160
    },
    "4":{
      "x":636.082,
      "y":390,
      "width":180,
      "height":160
    },
    "5":{
      "x":840.881,
      "y":390,
      "width":180,
      "height":160
    },
    "6":{
      "x":1045.68,
      "y":390,
      "width":180,
      "height":160
    },
    "7":{
      "x":1250.482,
      "y":390,
      "width":180,
      "height":160
    },
    "8":{
      "x":1455.282,
      "y":390,
      "width":180,
      "height":160
    },
    "9":{
      "x":1660.082,
      "y":390,
      "width":180,
      "height":160
    },
    "0":{
      "x":1864.88,
      "y":390,
      "width":180,
      "height":160
    },
    "q":{
      "x":21.687,
      "y":540,
      "width":180,
      "height":160
    },
    "w":{
      "x":226.482,
      "y":540,
      "width":180,
      "height":160
    },
    "e":{
      "x":431.283,
      "y":540,
      "width":180,
      "height":160
    },
    "r":{
      "x":636.082,
      "y":540,
      "width":180,
      "height":160
    },
    "t":{
      "x":840.881,
      "y":540,
      "width":180,
      "height":160
    },
    "y":{
      "x":1045.68,
      "y":540,
      "width":180,
      "height":160
    },
    "u":{
      "x":1250.482,
      "y":540,
      "width":180,
      "height":160
    },
    "i":{
      "x":1455.282,
      "y":540,
      "width":180,
      "height":160
    },
    "o":{
      "x":1660.082,
      "y":540,
      "width":180,
      "height":160
    },
    "p":{
      "x":1864.88,
      "y":540,
      "width":180,
      "height":160
    },
    "a":{
      "x":96.68,
      "y":690,
      "width":180,
      "height":160
    },
    "s":{
      "x":301.48,
      "y":690,
      "width":180,
      "height":160
    },
    "d":{
      "x":506.28,
      "y":690,
      "width":180,
      "height":160
    },
    "f":{
      "x":711.082,
      "y":690,
      "width":180,
      "height":160
    },
    "g":{
      "x":915.881,
      "y":690,
      "width":180,
      "height":160
    },
    "h":{
      "x":1120.68,
      "y":690,
      "width":180,
      "height":160
    },
    "j":{
      "x":1325.482,
      "y":690,
      "width":180,
      "height":160
    },
    "k":{
      "x":1530.282,
      "y":690,
      "width":180,
      "height":160
    },
    "l":{
      "x":1735.082,
      "y":690,
      "width":180,
      "height":160
    },
    "z":{
      "x":301.68,
      "y":840,
      "width":180,
      "height":160
    },
    "x":{
      "x":506.48,
      "y":840,
      "width":180,
      "height":160
    },
    "c":{
      "x":711.28,
      "y":840,
      "width":180,
      "height":160
    },
    "v":{
      "x":916.082,
      "y":840,
      "width":180,
      "height":160
    },
    "b":{
      "x":1120.88,
      "y":840,
      "width":180,
      "height":160
    },
    "n":{
      "x":1325.68,
      "y":840,
      "width":180,
      "height":160
    },
    "m":{
      "x":1530.482,
      "y":840,
      "width":180,
      "height":160
    },
    "mode":{
      "x":-40,
      "y":864,
      "width":340,
      "height":136
    },
    "<-":{
      "x":1750,
      "y":840,
      "width":226.71875,
      "height":160
    },
    "space":{
      "x":728.24,
      "y":992,
      "width":500,
      "height":160
    },
    "done":{
      "x":1678,
      "y":1010,
      "width":312,
      "height":140
    },
    "123":{
      "x":31.92,
      "y":1012,
      "width":259,
      "height":140
    }
  },
  "_misc":{
    "holdDelay": 500,
    "passwordDelay": 1000
  }
};


// Game logic loop
game.scripts.logic = (frame) => {

};


// Game render loop
game.scripts.render = (frame) => {
  if (frame >= 5) {
    game.animations.clear();

    // Display name of input
    if (frame === 1) alert(JSON.stringify(game.loadArgs));
    text(game.loadArgs.name, 52, "center", 100);

    // Display input
    let content = game.vars["_input" + game.loadArgs.name];
    if (frame === 1) alert(window.content === undefined);

    // Hide password
    if (game.loadArgs.password) {
      content = "X".repeat(content.length);

      if (Date.now() - game.local.passwordTimeout < game.scripts.layout._misc.passwordDelay) {
        content = content.slice(0, -1) + game.vars["_input" + game.loadArgs.name].slice(-1);
      }
    }
    text(content, 36, "center", 200);


    // Generate keyboard
    if (game.vars.keyboard === undefined && frame === 5) {

      game.vars.keyboard = {};

      // Create offscreen keyboards for lower/upper
      ['lower', 'upper', 'lowerSpecial', 'upperSpecial'].forEach((type) => {
        let arr;

        game.vars.keyboard[type] = {
          canvas: document.createElement('canvas')
        };

        // Generate Canvas
        game.vars.keyboard[type].canvas.width = game.canvas.rwidth;
        game.vars.keyboard[type].canvas.height = game.canvas.rheight;
        game.vars.keyboard[type].ctx = game.vars.keyboard[type].canvas.getContext('2d');

        // Start paths
        game.vars.keyboard[type].ctx.beginPath();

        // // Number row
        // game.vars.keyboard[type].ctx.moveTo(0,400);
        // game.vars.keyboard[type].ctx.lineTo(game.canvas.rwidth,400);

        // ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].forEach((letter, index) => {
        //   game.vars.keyboard[type].ctx.moveTo(game.canvas.rwidth*(index+1)*.1, 400)
        //   game.vars.keyboard[type].ctx.lineTo(game.canvas.rwidth*(index+1)*.1, 550);
        //   text(letter, 60, game.canvas.rwidth*.035+game.canvas.rwidth*index*.1, 500, game.vars.keyboard[type].ctx);
        // });

        // Row 1
        game.vars.keyboard[type].ctx.moveTo(0,550);
        game.vars.keyboard[type].ctx.lineTo(game.canvas.rwidth,550);

        if (type === "lower" || type === "upper") {
          arr = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
        } else {
          arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        }

        arr.forEach((letter, index) => {
          if (type === "upper") letter = String.fromCharCode(letter.charCodeAt()-32);
          game.vars.keyboard[type].ctx.moveTo(game.canvas.rwidth*(index+1)*.1, 550)
          game.vars.keyboard[type].ctx.lineTo(game.canvas.rwidth*(index+1)*.1, 700);
          text(letter, 60, game.canvas.rwidth*.035+game.canvas.rwidth*index*.1, 650, game.vars.keyboard[type].ctx);
        });

        // Row 2
        game.vars.keyboard[type].ctx.moveTo(0,700);
        game.vars.keyboard[type].ctx.lineTo(game.canvas.rwidth,700);

        if (type === "lower" || type === "upper") {
          arr = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
        } else {
          arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        }

        arr.forEach((letter, index) => {
          if (type === "upper") letter = String.fromCharCode(letter.charCodeAt()-32);
          game.vars.keyboard[type].ctx.moveTo(game.canvas.rwidth*(index+1)*.1+75, 700)
          game.vars.keyboard[type].ctx.lineTo(game.canvas.rwidth*(index+1)*.1+75, 850);
          text(letter, 60, game.canvas.rwidth*.035+game.canvas.rwidth*index*.1+75, 800, game.vars.keyboard[type].ctx);
        });

        // A left vertical line
        game.vars.keyboard[type].ctx.moveTo(game.canvas.rwidth*.05, 700);
        game.vars.keyboard[type].ctx.lineTo(game.canvas.rwidth*.05, 850);

        // Row 3
        game.vars.keyboard[type].ctx.moveTo(0,850);
        game.vars.keyboard[type].ctx.lineTo(game.canvas.rwidth,850);

        if (type === "lower" || type === "upper") {
          arr = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
        } else {
          arr = ['1', '2', '3', '4', '5', '6', '7'];
        }

        arr.forEach((letter, index) => {
          if (type === "upper") letter = String.fromCharCode(letter.charCodeAt()-32);
          game.vars.keyboard[type].ctx.moveTo(game.canvas.rwidth*(index+1)*.1+280, 850)
          game.vars.keyboard[type].ctx.lineTo(game.canvas.rwidth*(index+1)*.1+280, 1000);
          text(letter, 60, game.canvas.rwidth*.035+game.canvas.rwidth*index*.1+280, 950, game.vars.keyboard[type].ctx);
        });

        if (type === "lower" || type ==" upper") {
          text(type === "upper" ? "lower" : "upper", 36, 10, 950, game.vars.keyboard[type].ctx);
        } else {
          text(type === "lowerSpecial" ? "!@#" : "123", 36, 10, 950, game.vars.keyboard[type].ctx);
        }
        text("<-", 60, 1800, 950, game.vars.keyboard[type].ctx);

        // Z left vertical line
        game.vars.keyboard[type].ctx.moveTo(game.canvas.rwidth*1*.1+75, 850);
        game.vars.keyboard[type].ctx.lineTo(game.canvas.rwidth*1*.1+75, 1000);

        // Row 4
        game.vars.keyboard[type].ctx.moveTo(0,1000);
        game.vars.keyboard[type].ctx.lineTo(game.canvas.rwidth,1000);

        // Space bar
        game.vars.keyboard[type].ctx.moveTo(game.canvas.rwidth*.035+game.canvas.rwidth*.15, 1000);
        game.vars.keyboard[type].ctx.lineTo(game.canvas.rwidth*.035+game.canvas.rwidth*.15, game.canvas.rheight);

        game.vars.keyboard[type].ctx.moveTo(game.canvas.rwidth*.035+game.canvas.rwidth*.75, 1000);
        game.vars.keyboard[type].ctx.lineTo(game.canvas.rwidth*.035+game.canvas.rwidth*.75, game.canvas.rheight);

        text("Space", 60, game.canvas.rwidth*.38, game.canvas.rheight-50, game.vars.keyboard[type].ctx);

        // Special
        text(type !== "lowerSpecial" ? "123" : "ABC", 40, game.canvas.rwidth*.04, game.canvas.rheight-50, game.vars.keyboard[type].ctx);

        text('Done', 40, game.canvas.rwidth-320, 1100, game.vars.keyboard[type].ctx);

        game.vars.keyboard[type].ctx.stroke();
        game.vars.keyboard[type].ctx.closePath();
      });
    }

    // render keyboard
    game.canvas.ctx.drawImage(game.vars.keyboard[game.local.mode].canvas, 0, 0);
  }
};
