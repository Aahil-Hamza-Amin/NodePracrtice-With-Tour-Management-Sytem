const { log } = require('console');
const fs = require('fs');

fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    if (err) {
        return console.log('Error😒');
    }else{
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Your File has benn Written!');
                }
            })
        })
    })
}
})

console.log('Will read file!');
