
eval('alert("I am evil eval")');

var f = new Function ('alert("I am evil Function")');
f();


alert('I am evil 1...');
window.alert('I am evil 2...');
this['window'].alert('I am evil 3...');
this['w'+ 'indow'].alert('I am evil 4...');
var e = this;
e.alert('I am evil 5...');
var e2 = 'alert';
this[e2]('I am evil 6...');

function doit() {
    var str = 'i am evil 7...';
    alert(str);
}

function doit() {
    // Redeclare, test esmangle
}

doit();


