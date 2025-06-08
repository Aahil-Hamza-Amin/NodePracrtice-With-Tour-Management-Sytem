// console.log(arguments);

// console.log(require('module').wrapper);

// module.exports
const C = require('./test-module-1-moduleDOTexports');
const calc1 = new C();
console.log(calc1.add(2, 5));

//exports
// const calc2 = require('./test-module-2');
// console.log(calc2.multiply(2, 5));

//Destructuring
const { add, multiply, divide } = require('./test-module-2-exportsShorthand');
console.log(multiply(2, 5));

// Cashing
require('./test-module-3-Cashing')();
require('./test-module-3-Cashing')();
require('./test-module-3-Cashing')();