const fs = require('fs');
const crypto = require('crypto')

const start = Date.now();
process.env.UV_THREADOOL_SIZE = 6;

setTimeout(() => {
    console.log('Timer 1 Finished!');
}, 0);

setImmediate(() => {
    console.log('Immediate 1 finished!');
})

fs.readFile('./test-file.txt', () => {
    console.log('I/O finished!');
    console.log('----------');

    setTimeout(() => {
        console.log('Timer 2 Finished!');
    }, 0);
    setTimeout(() => {
        console.log('Timer 3 Finished!');
    }, 3000);

    setImmediate(() => {
        console.log('Immediate 2 finished!');
    })

    process.nextTick(() => {
        console.log('Process.nextTick');
    })

    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, 'Password Encrypted');
    })
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, 'Password Encrypted');
    })
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, 'Password Encrypted');
    })
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, 'Password Encrypted');
    })
})

console.log('Hello from the top-level-code');