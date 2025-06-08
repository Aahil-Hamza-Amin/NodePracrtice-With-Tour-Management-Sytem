// Non-blocking, Asynchronous Code
const fs = require('fs');

fs.readFile('./txt/input.txt', 'utf-8', (err, data1) => {
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);
        fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
            console.log(data3);
            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, err => console.log('File has been Written🤣')
            )
        })
    })
})

console.log("will read file!");

