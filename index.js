

console.log("START");

var htmlParser = require('./modules/htmlParser.js');
var styleParser = require('./modules/styleParser.js');

var filepath = "files/twig/";
var stylepath = "files/scss/";

htmlParser(filepath).then(function(resp) {
    // console.log(resp);
});

styleParser(stylepath).then(function(resp) {
    // console.log(resp);
});

