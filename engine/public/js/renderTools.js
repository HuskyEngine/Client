// Set to true to output computed click areas for texts and inputs
let debug = false;

function text(text, info, x, y, canvas=L_MAIN) {
  let size;
  if (typeof info === "object") {
    canvas.ctx.font = `${info.size*canvas.scale()}pt ${info.font}`;
    size = info.size;
  } else if (typeof info === "number") {
    canvas.ctx.font = info*canvas.scale() + "pt " + game.vars.defaultFont;
    size = info;
  } else {
    let ind = info.indexOf('pt');
    info = info.slice(0, ind)*canvas.scale() + info.slice(ind);
    canvas.ctx.font = info;
    size = info;
  }

  let xCenter = ((canvas.element.width/2)-(canvas.ctx.measureText(text).width/2));
  let yCenter = canvas.element.height/2;

  // X
  // Center
  if (x === "center") x = xCenter;
  // Specific px
  else if (typeof x === "string" && x.slice(-2) === "px") x = Number(x.slice(0, -2).trim());
  // Percentage
  else x = Number(x) * .01 * canvas.element.width;
  // If X is invalid, default to center
  if (Number.isNaN(x)) x = xCenter;

  // Y
  // Center
  if (y === "center") y = yCenter;
  // Specific px
  else if (typeof y === "string" && y.slice(-2) === "px") y = Number(y.slice(0, -2).trim());
  // Percentage
  else y = Number(y) * .01 * canvas.element.height;
  // If Y is invalid, default to center
  if (Number.isNaN(y)) y = yCenter;

  if (debug && game.renderFrame === 10) {
    console.log(`"${text}":{
  "x":${x-50},
  "y":${y-size-50},
  "width":${canvas.ctx.measureText(text).width+100},
  "height":${size+100}
}`);
  }

  canvas.ctx.fillText(text, x, y);
}

function fillRect(x1, y1, x2, y2, canvas=L_MAIN) {
  let xCenter = canvas.element.width/2;
  let yCenter = canvas.element.height/2;

  // X1
  // Center
  if (x1 === "center") x1 = xCenter;
  // Specific px
  else if (typeof x1 === "string" && x1.slice(-2) === "px") x1 = Number(x1.slice(0, -2).trim());
  // Percentage
  else x1 = Number(x1) * .01 * canvas.element.width;
  // If X is invalid, default to center
  if (Number.isNaN(x1)) x1 = xCenter;

  // X2
  // Center
  if (x2 === "center") x2 = xCenter;
  // Specific px
  else if (typeof x2 === "string" && x2.slice(-2) === "px") x2 = Number(x2.slice(0, -2).trim());
  // Percentage
  else x2 = Number(x2) * .01 * canvas.element.width;
  // If X is invalid, default to center
  if (Number.isNaN(x2)) x2 = xCenter;

  // Y1
  // Center
  if (y1 === "center") y1 = yCenter;
  // Specific px
  else if (typeof y1 === "string" && y1.slice(-2) === "px") y1 = Number(y1.slice(0, -2).trim());
  // Percentage
  else y1 = Number(y1) * .01 * canvas.element.height;
  // If Y is invalid, default to center
  if (Number.isNaN(y1)) y1 = yCenter;

  // Y2
  // Center
  if (y2 === "center") y2 = yCenter;
  // Specific px
  else if (typeof y2 === "string" && y2.slice(-2) === "px") y2 = Number(y2.slice(0, -2).trim());
  // Percentage
  else y2 = Number(y2) * .01 * canvas.element.height;
  // If Y is invalid, default to center
  if (Number.isNaN(y2)) y2 = yCenter;

  canvas.ctx.fillRect(x1, y1, x2, y2);
}

function input(name, info, maxlen, x, y, password=false, canvas=L_MAIN) {
  let size;
  if (typeof info === "object") {
    canvas.ctx.font = `${info.size}pt ${info.font}`;
    size = info.size;
  } else {
    canvas.ctx.font = info + game.vars.defaultFont;
    size = info;
  }

  canvas.ctx.beginPath();

  // Get width of a W using provided font size
  let charSize = canvas.ctx.measureText("W").width;
  let width = charSize*maxlen;

  let xCenter = ((canvas.element.width/2)-(canvas.ctx.measureText(text).width/2));
  let yCenter = canvas.element.height/2;

  // X
  // Center
  if (x === "center") x = xCenter;
  // Specific px
  else if (typeof x === "string" && x.slice(-2) === "px") x = Number(x.slice(0, -2).trim());
  // Percentage
  else x = Number(x) * .01 * canvas.element.width;
  // If X is invalid, default to center
  if (Number.isNaN(x)) x = xCenter;

  // Y
  // Center
  if (y === "center") y = yCenter;
  // Specific px
  else if (typeof y === "string" && y.slice(-2) === "px") y = Number(y.slice(0, -2).trim());
  // Percentage
  else y = Number(y) * .01 * canvas.element.height;
  // If Y is invalid, default to center
  if (Number.isNaN(y)) y = yCenter;

  canvas.ctx.rect(x-size*.5, y-size-size*.5, width+width*.1, size+size);

  let content = (game.vars["_input" + name] || "");
  if (password) {
    content = "X".repeat(content.length);
  }

  canvas.ctx.fillText(content, x, y);

  canvas.ctx.stroke();
  canvas.ctx.closePath();

  if (debug && game.renderFrame === 10) {
    console.log(`"${name}":{
  "x":${x-size*.5-50},
  "y":${y-size-size*.5-50},
  "width":${width+width*.1+100},
  "height":${size+size+100}
}`);
  }
}

function box(contents, info, x, y, canvas=L_MAIN) {
  let size;
  if (typeof info === "object") {
    canvas.ctx.font = `${info.size}pt ${info.font}`;
    size = info.size;
  } else {
    canvas.ctx.font = info + game.vars.defaultFont;
    size = info;
  }

  canvas.ctx.beginPath();

  // Get width of a W using provided font size
  let charSize = canvas.ctx.measureText("W").width;
  let width = charSize*contents.length;

  let xCenter = ((canvas.element.width/2)-(canvas.ctx.measureText(text).width/2));
  let yCenter = canvas.element.height/2;

  // X
  // Center
  if (x === "center") x = xCenter;
  // Specific px
  else if (typeof x === "string" && x.slice(-2) === "px") x = Number(x.slice(0, -2).trim());
  // Percentage
  else x = Number(x) * .01 * canvas.element.width;
  // If X is invalid, default to center
  if (Number.isNaN(x)) x = xCenter;

  // Y
  // Center
  if (y === "center") y = yCenter;
  // Specific px
  else if (typeof y === "string" && y.slice(-2) === "px") y = Number(y.slice(0, -2).trim());
  // Percentage
  else y = Number(y) * .01 * canvas.element.height;
  // If Y is invalid, default to center
  if (Number.isNaN(y)) y = yCenter;

  canvas.ctx.rect(x-size*.5, y-size-size*.5, width+width*.1, size+size);
  canvas.ctx.fillText(contents, x, y);
  canvas.ctx.stroke();
  canvas.ctx.closePath();
}

function drawImage(image, sx, sy, sWidth=null, sHeight=null, dx=null, dy=null, dWidth=null, dHeight=null, canvas=L_MAIN) {
  if (typeof image === "string") {
    image = game.assets.images[image];
  }

  if (image === undefined) {
    game.helpers.load('error', {type: "IMAGE_NOT_FOUND", msg: `Attempt to draw image "${image}" failed.`});
  }

  if (sHeight === null) {
    // Default canvas
    if (sWidth === null) {
      canvas.ctx.drawImage(image, sx, sy);
    } else {
      sWidth.ctx.drawImage(image, sx, sy);
    }

  } else if (dy === null) {
    // Default canvas
    if (dx === null) {
      canvas.ctx.drawImage(image, sx, sy, sWidth, sHeight);
    } else {
      dx.ctx.drawImage(image, sx, sy, sWidth, sHeight);
    }
  } else {
    canvas.ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }
}

function drawTile(tilesheet, sx, sy, sWidth=null, sHeight=null, dx=null, dy=null, dWidth=null, dHeight=null, canvas=L_MAIN) {
  if (typeof tilesheet === "string") {
    tilesheet = game.assets.tilesheets[tilesheet];
  }

  if (tilesheet === undefined) {
    game.helpers.load('error', {type: "IMAGE_NOT_FOUND", msg: `Attempt to draw image "${tilesheet}" failed.`});
  }

  if (sHeight === null) {
    // Default canvas
    if (sWidth === null) {
      canvas.ctx.drawImage(tilesheet, sx, sy);
    } else {
      sWidth.ctx.drawImage(tilesheet, sx, sy);
    }

  } else if (dy === null) {
    // Default canvas
    if (dx === null) {
      canvas.ctx.drawImage(tilesheet, sx, sy, sWidth, sHeight);
    } else {
      dx.ctx.drawImage(tilesheet, sx, sy, sWidth, sHeight);
    }
  } else {
    canvas.ctx.drawImage(tilesheet, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }
}

function drawAnimation(image, dx, dy, frame, canvas=L_MAIN) {
  if (dx === "center") dx = canvas.element.width/2;
  if (dy === "center") dy = canvas.element.height/2;

  if (game.assets.animations[image] === undefined) {
    game.helpers.load('error', {type: "ANIMATION_NOT_FOUND", msg: `Attempt to draw animation "${image}" failed.`});
  }

  canvas.ctx.drawImage(game.assets.animations[image], game.assets.animations[image].info.width*frame, 0, game.assets.animations[image].info.width, game.assets.animations[image].info.height, dx, dy, game.assets.animations[image].info.width*4, game.assets.animations[image].height*4);
}

function drawSprite(spriteInfo, dx, dy, width=null, height=null, canvas=L_MAIN) {
  let sprite = game.assets.sprites[spriteInfo[0]];

  if (sprite === undefined) {
    game.helpers.load('error', {type: "SPRITE_NOT_FOUND", msg: `Attempt to draw sprite "${spriteInfo[0]}" failed.`});
  }

  if (sprite.info[spriteInfo[1]] === undefined) {
    game.helpers.load('error', {type: "SPRITE_MOVEMENT_NOT_FOUND", msg: `Sprite movement (${spriteInfo[1]}) not found in "${spriteInfo[0]}" JSON specs.`});
  }

  if (sprite.info[spriteInfo[1]][spriteInfo[2]] === undefined) {
    game.helpers.load('error', {type: "SPRITE_DIRECTION_NOT_FOUND", msg: `Sprite direction (${spriteInfo[2]}) for movement (${spriteInfo[1]}) not found in "${spriteInfo[0]}" JSON specs.`});
  }

  if (sprite.info[spriteInfo[1]][spriteInfo[2]].frames < spriteInfo[3] || spriteInfo[3] < 1) {
    game.helpers.load('error', {type: "SPRITE_FRAME_NOT_FOUND", msg: `Sprite frame (${spriteInfo[3]}) for direction (${spriteInfo[2]}) for movement (${spriteInfo[1]}) not found in "${spriteInfo[0]}" JSON specs.`});
  }

  let animation = sprite.info[spriteInfo[1]][spriteInfo[2]];

  if (dx === "center") dx = canvas.element.width/2;
  if (dy === "center") dy = canvas.element.height/2;

  // Update position with offsets
  dx += animation.offsetX;
  dy += animation.offsetY;

  if (typeof width === "object") {
    canvas = width;
  }

  if (height === null) {
    width  = animation.width;
    height = animation.height;
  }

  // image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  canvas.ctx.drawImage(sprite, animation.x + ((spriteInfo[3]-1) * animation.width), animation.y, animation.width, animation.height, dx, dy, width*4, height*4);
}

function drawSpriteReflection(spriteInfo, dx, dy, width=null, height=null, canvas=L_MAIN) {
  let sprite = game.assets.sprites[spriteInfo[0]];

  if (sprite === undefined) {
    game.helpers.load('error', {type: "SPRITE_NOT_FOUND", msg: `Attempt to draw sprite "${spriteInfo[0]}" failed.`});
  }

  if (sprite.info[spriteInfo[1]] === undefined) {
    game.helpers.load('error', {type: "SPRITE_MOVEMENT_NOT_FOUND", msg: `Sprite movement (${spriteInfo[1]}) not found in "${spriteInfo[0]}" JSON specs.`});
  }

  if (sprite.info[spriteInfo[1]][spriteInfo[2]] === undefined) {
    game.helpers.load('error', {type: "SPRITE_DIRECTION_NOT_FOUND", msg: `Sprite direction (${spriteInfo[2]}) for movement (${spriteInfo[1]}) not found in "${spriteInfo[0]}" JSON specs.`});
  }

  if (sprite.info[spriteInfo[1]][spriteInfo[2]].frames < spriteInfo[3] || spriteInfo[3] < 1) {
    game.helpers.load('error', {type: "SPRITE_FRAME_NOT_FOUND", msg: `Sprite frame (${spriteInfo[3]}) for direction (${spriteInfo[2]}) for movement (${spriteInfo[1]}) not found in "${spriteInfo[0]}" JSON specs.`});
  }

  let animation = sprite.info[spriteInfo[1]][spriteInfo[2]];

  if (dx === "center") dx = canvas.element.width/2;
  if (dy === "center") dy = canvas.element.height/2;

  // Update position with offsets
  dx += animation.offsetX;
  dy += animation.offsetY;

  if (typeof width === "object") {
    canvas = width;
  }

  if (height === null) {
    width  = animation.width;
    height = animation.height;
  }

  let parts = 5;

  let aheight  = animation.height/parts;
  let aheight2 = (height*4)/parts;

  for (let i = 0; i < parts; i++) {
    canvas.ctx.drawImage(sprite, animation.x + ((spriteInfo[3]-1) * animation.width), animation.y+aheight*i, animation.width, aheight, dx+game.vars['rand' + i], dy+aheight2*i, width*4, aheight2);
  }
}

function alpha(val=undefined, canvas=L_MAIN) {
  if (val === undefined) return canvas.ctx.globalAlpha;
  else if (typeof val === "object") return val.ctx.globalAlpha;
  canvas.ctx.globalAlpha = val;
}

function fillStyle(val=undefined, canvas=L_MAIN) {
  if (val === undefined) return canvas.ctx.fillStyle;
  else if (typeof val === "object") return val.ctx.fillStyle;
  canvas.ctx.fillStyle = val;
}

game.animations = {
  clear(canvas=L_MAIN) {
   alpha(1, canvas);
   canvas.ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);
  }
};
