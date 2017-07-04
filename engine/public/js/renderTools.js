// Set to true to output computed click areas for texts and inputs
let debug = false;

function text(text, info, x, y, canvas=game.canvas.ctx) {
  let size;
    if (typeof info === "object") {
      canvas.font = `${info.size}pt ${info.font}`;
      size = info.size;
    } else {
      canvas.font = info + game.vars.defaultFont;
      size = info;
    }

  if (x === "center") x = ((game.canvas.rwidth/2)-(canvas.measureText(text).width/2));
  if (y === "center") y = game.canvas.rheight/2;

  if (debug && game.renderFrame === 10) {
    console.log(`"${text}":{
  "x":${x-50},
  "y":${y-size-50},
  "width":${canvas.measureText(text).width+100},
  "height":${size+100}
}`);
  }

  canvas.fillText(text, x, y);
}

function input(name, info, maxlen, x, y, password=false, canvas=game.canvas.ctx) {
  let size;
  if (typeof info === "object") {
    canvas.font = `${info.size}pt ${info.font}`;
    size = info.size;
  } else {
    canvas.font = info + game.vars.defaultFont;
    size = info;
  }

  canvas.beginPath();

  // Get width of a W using provided font size
  let charSize = canvas.measureText("W").width;
  let width = charSize*maxlen;

  if (x === "center") x = ((game.canvas.rwidth/2)-(canvas.measureText(text).width/2));
  if (y === "center") y = game.canvas.rheight/2;

  canvas.rect(x-size*.5, y-size-size*.5, width+width*.1, size+size);

  let content = (game.vars["_input" + name] || "");
  if (password) {
    content = "X".repeat(content.length);
  }

  canvas.fillText(content, x, y);

  canvas.stroke();
  canvas.closePath();

  if (debug && game.renderFrame === 10) {
    console.log(`"${name}":{
  "x":${x-size*.5-50},
  "y":${y-size-size*.5-50},
  "width":${width+width*.1+100},
  "height":${size+size+100}
}`);
  }
}

function box(contents, info, x, y, canvas=game.canvas.ctx) {
  let size;
  if (typeof info === "object") {
    canvas.font = `${info.size}pt ${info.font}`;
    size = info.size;
  } else {
    canvas.font = info + game.vars.defaultFont;
    size = info;
  }

  canvas.beginPath();

  // Get width of a W using provided font size
  let charSize = canvas.measureText("W").width;
  let width = charSize*contents.length;

  if (x === "center") x = ((game.canvas.rwidth/2)-(canvas.measureText(contents).width/2));
  if (y === "center") y = game.canvas.rheight/2;

  canvas.rect(x-size*.5, y-size-size*.5, width+width*.1, size+size);
  canvas.fillText(contents, x, y);
  canvas.stroke();
  canvas.closePath();
}

function drawImage(image, sx, sy, sWidth=null, sHeight=null, dx=null, dy=null, dWidth=null, dHeight=null, canvas=game.canvas.ctx) {
  if (game.assets.images[image] === undefined) {
    game.helpers.load('error', {type: "IMAGE_NOT_FOUND", msg: `Attempt to draw image "${image}" failed.`});
  }

  if (sHeight === null) {
    // Default canvas
    if (sWidth === null) {
      canvas.drawImage(game.assets.images[image], sx, sy);
    } else {
      sWidth.drawImage(game.assets.images[image], sx, sy);
    }

  } else if (dy === null) {
    // Default canvas
    if (dx === null) {
      canvas.drawImage(game.assets.images[image], sx, sy, sWidth, sHeight);
    } else {
      dx.drawImage(game.assets.images[image], sx, sy, sWidth, sHeight);
    }
  } else {

    canvas.drawImage(game.assets.images[image], sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }
}

function alpha(val=undefined, canvas=game.canvas.ctx) {
  if (val === undefined) return canvas.globalAlpha;
  canvas.globalAlpha = val;
}

function fillStyle(val=undefined, canvas=game.canvas.ctx) {
  if (val === undefined) return canvas.fillStyle;
  canvas.fillStyle = val;
}

game.animations = {
  clear(canvas=game.canvas.ctx) {
   alpha(1, canvas);
   canvas.clearRect(0, 0, game.canvas.rwidth, game.canvas.rheight);
  }
};
