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
// Consuming Promises with Async/Await

const getDogPic = async () => {
    try {


        const data = await readFilePromise(`${__dirname}/dog.txt`);
        console.log({ Breed: `${data}` });
        // Resolving more than 1 promises
        const res1Promise = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
        const res2Promise = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
        const res3Promise = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)

        const promiseAll = await Promise.all([res1Promise, res2Promise, res3Promise])

        const imgs = promiseAll.map(el => el.body.message)
        console.log(imgs);

        await writeFilePromise(`${__dirname}/dog-test.txt`, imgs.join('\n'));
        console.log('File Written Successfuly!');
    } catch (err) {
        console.log(err);
        throw err;
    }
    return '2: Ready🐇';
}

(async () => {
    try {
        console.log('1: Will get dog Pics!');
        const returnedPrmiseStr = await getDogPic();
        console.log(returnedPrmiseStr);
        console.log('3: Done getting dog Pics!');

    } catch (err) {
        console.log('Error');
    }
}
)()
