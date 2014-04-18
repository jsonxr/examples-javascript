//----------------------------------------------------------------------------
// Create javascript sandbox from untrusted javascript
// Ideas implemented from the following paper
// http://www.doc.ic.ac.uk/~maffeis/papers/esorics09.pdf
//
// 1) Filtering
// 2) Rewriting
// 3) Wrapping
//----------------------------------------------------------------------------

var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var esmangle = require('esmangle');
var escope = require('escope');
var fs = require('fs');
var util = require('util');

var code = fs.readFileSync('simple.js');
var ast = esprima.parse(code);


function createsNewScope(node) {
    return node.type === 'FunctionDeclaration' ||
            node.type === 'FunctionExpression' ||
            node.type === 'Program';
}
var scopeChain = [];
var assignments = [];

function printScope(scope, node){
  var varsDisplay = scope.join(', ');
  if (node.type === 'Program'){
    console.log('Variables declared in the global scope:', 
      varsDisplay);
  }else{
    if (node.id && node.id.name){
      console.log('Variables declared in the function ' + node.id.name + '():',
        varsDisplay);
    }else{
      console.log('Variables declared in anonymous function:',
        varsDisplay);
    }
  }
}

function isVarDefined(varname, scopeChain){
  for (var i = 0; i < scopeChain.length; i++){
    var scope = scopeChain[i];
    if (scope.indexOf(varname) !== -1){
      return true;
    }
  }
  return false;
}

// http://tobyho.com/2013/12/02/fun-with-esprima/

estraverse.traverse(ast, {
    enter: function(node){
        if (createsNewScope(node)) {
            scopeChain.push([]);
        }
        if (node.type === 'VariableDeclarator') {
            node.id.name = node.id.name;
            var currentScope = scopeChain[scopeChain.length - 1];
            currentScope.push(node.id.name);
        }

        if (node.type === 'AssignmentExpression'){
            assignments.push(node.left.name);
        }
        
        if (node.type === 'ExpressionStatement') {
            console.log(JSON.stringify(node));
            if (node.expression.left.type === 'Identifier') {
                node.expression.left.name = node.expression.left.name;
            }
        }
    
    },
    leave: function leave(node){
        if (createsNewScope(node)){
            var currentScope = scopeChain.pop();
            printScope(currentScope, node);
            checkForLeaks(as)
        }
    }
});


// 
// //var result = esmangle.pass(ast);
// 
// 
// fs.writeFileSync('ast.json', JSON.stringify(ast));
// 
// 
fs.writeFileSync('cleaned.js', escodegen.generate(ast, { 
    format: {
        indent: {
            style: '    ',
            base: 0,
            adjustMultilineComment: false
        },
        newline: '\n',
        space: ' ',
        json: false,
        renumber: false,
        hexadecimal: false,
        quotes: 'single',
        escapeless: false,
        compact: false,
        parentheses: true,
        semicolons: true,
        safeConcatenation: false,
        parse: null,
        comment: false
    }, 
}));
