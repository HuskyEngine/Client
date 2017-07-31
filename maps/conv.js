var fs = require('fs');
var a = fs.readFileSync('./default.json');
a = JSON.parse(a)
var b = new Array(50).fill().map(r => new Array(50).fill().map(c => [0, 0]));
a.forEach((row, i) => {
  row.forEach((col, j) => {
    b[i][j][0] = 0;
    b[i][j][1] = Math.max((a[i][j].layers[0] || 0), (a[i][j].layers[1] || 0));
  })
})
console.log(JSON.stringify(b));
