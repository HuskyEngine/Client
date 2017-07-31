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

function drawAnimation(image, dx, dy, frame, canvas=game.canvas.ctx) {
  if (dx === "center") dx = game.canvas.rwidth/2;
  if (dy === "center") dy = game.canvas.rheight/2;

  if (game.assets.animations[image] === undefined) {
    game.helpers.load('error', {type: "ANIMATION_NOT_FOUND", msg: `Attempt to draw animation "${image}" failed.`});
  }

  canvas.drawImage(game.assets.animations[image], game.assets.animations[image].info.width*frame, 0, game.assets.animations[image].info.width, game.assets.animations[image].info.height, dx, dy, game.assets.animations[image].info.width*4, game.assets.animations[image].height*4);
}

function drawSprite(spriteInfo, dx, dy, width=null, height=null, canvas=game.canvas.ctx) {
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

  if (dx === "center") dx = game.canvas.rwidth/2;
  if (dy === "center") dy = game.canvas.rheight/2;

  // Update position with offsets
  dx += animation.offsetX;
  dy += animation.offsetY;

  // Default canvas and no width/height
  if (width === null) {
    width  = animation.width;
    height = animation.height;

  // No width/height but custom canvas
  } else if (!Number.isInteger(width)) {
    canvas = width;
  }

  // image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  canvas.drawImage(sprite, animation.x + ((spriteInfo[3]-1) * animation.width), animation.y, animation.width, animation.height, dx, dy, width*4, height*4);
}

function drawSpriteReflection(spriteInfo, dx, dy, width=null, height=null, canvas=game.canvas.ctx) {
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

  if (dx === "center") dx = game.canvas.rwidth/2;
  if (dy === "center") dy = game.canvas.rheight/2;

  // Update position with offsets
  dx += animation.offsetX;
  dy += animation.offsetY;

  // Default canvas and no width/height
  if (width === null) {
    width  = animation.width;
    height = animation.height;

  // No width/height but custom canvas
  } else if (!Number.isInteger(width)) {
    canvas = width;
  }

  let aheight  = animation.height/3;
  let aheight2 = (height*4)/3
  canvas.drawImage(sprite, animation.x + ((spriteInfo[3]-1) * animation.width), animation.y,           animation.width, aheight, dx+game.vars.rand1, dy,            width*4, aheight2);
  canvas.drawImage(sprite, animation.x + ((spriteInfo[3]-1) * animation.width), animation.y+aheight,   animation.width, aheight, dx+game.vars.rand2, dy+aheight2,   width*4, aheight2);
  canvas.drawImage(sprite, animation.x + ((spriteInfo[3]-1) * animation.width), animation.y+aheight*2, animation.width, aheight, dx+game.vars.rand3, dy+aheight2*2, width*4, aheight2);
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
