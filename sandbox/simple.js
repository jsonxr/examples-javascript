var game = require('./game');



var mistypedVaraible = 17; // throws a ReferenceError

var f = 'jason',
    g = f + ' rowland';

game.log('i was here.');

function doit() {
    game.log('doit' + g);
}
doit();
