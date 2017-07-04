const fs        = require('fs');
const path      = require('path');
const express   = require('express');
const recursive = require("recursive-readdir");
const router    = express.Router();
const config    = require('../../config.json');

let filesList = [];

recursive("./assets/images", (err, files) => {
  filesList = files.filter((file) => {
    return ['.DS_Store', '.gitKeep'].indexOf(file.substring(file.lastIndexOf('/')+1)) === -1;
  }).map((file) => file.slice(14));
});

router.get('/', (req, res, next) => {
  res.render('index', {title: config.name});
});

router.get('/scenes/load.js', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'builtin', 'load.js'));
});

router.get('/scenes/input.js', (req, res, next) => {
  if (fs.existsSync(path.join(__dirname, '..', '..', 'scenes', 'input.js'))) {
    res.sendFile(path.join(__dirname, '..', '..', 'scenes', 'input.js'));
  } else {
    res.sendFile(path.join(__dirname, '..', 'builtin', 'input.js'));
  }
});

router.get('/scenes/error.js', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'builtin', 'error.js'));
});

router.get('/assets.manifest', (req, res, next) => {
  res.send(filesList);
});

router.get('/css/font.css', (req, res, next) => {
  let font = "";
  config.fonts.forEach((item) => {
    if (item.name === null) return;
    font += `@font-face {
  font-family: "${item.name}";
  src: url("../fonts/${item.src}") format("truetype");
  font-weight: normal;
  font-style: normal;
}
`;
  });

  res.contentType('text/css');
  res.send(font);
});

router.get('/config', (req, res, next) => {
  res.send({
    debug: config.debug,
    defaultFont: (config.fonts === undefined || config.fonts.length === 0 || config.fonts[0].name === null) ? "pt Arial" : "pt " + config.fonts[0].name
  });
});

module.exports = router;
