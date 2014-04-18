var assert = require('assert');
var fs = require('fs');
var util = require('util');
var JSLINT = require('./jslint');

require('./simple')

var code = fs.readFileSync('simple.js', 'utf8');
if (! JSLINT(code, { predef:["game","require"], sloppy: true })) {
    console.log(util.inspect(JSLINT.errors));
} else {
    require('./simple');
}
