const fs = require('fs');
const superagent = require('superagent');

const readFilePromise = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) reject('There is an Error While Reading File');
            resolve(data);
        })
    });
};

const writeFilePromise = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, (err) => {
            if (err) reject('Error While Writing File!');
            resolve('File Written Successfuly!👌')
        })
    })
}
// Consuming Promises 
readFilePromise(`${__dirname}/dog.txt`)
    .then(data => {
        console.log({ Breed: `${data}` });
        return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
    })
    .then(res => {
        console.log(res.body.message)
        return writeFilePromise(`${__dirname}/dog-test.txt`, res.body.message)
    })
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.log(err);
    })













// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//     console.log({ 'Breed': `${data}` });
//     superagent
//         .get(`https://dog.ceo/api/breed/${data}/images/random`)
//         .end((err, res) => {
//             console.log(res.body.message);
//             fs.writeFile('dog-test.txt', res.body.message, (err) => {
//                 if (err) return console.log(err);
//                 console.log('File Has Been Written Successully!');
//             })
//         })

// })