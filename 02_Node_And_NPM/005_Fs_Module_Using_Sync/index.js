// Blocking, Synchoronous Code
const fs = require('fs');

const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

console.log(textIn);

const textOut = `This is Wat we now ABout console: ${textIn}.\nCreated on ${Date.now()}`;

fs.writeFileSync('./txt/output.txt',textOut);
console.log('File Has Been Written');
