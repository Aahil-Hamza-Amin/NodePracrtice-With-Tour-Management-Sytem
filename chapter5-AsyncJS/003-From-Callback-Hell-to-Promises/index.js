const fs = require('fs');
const superagent = require('superagent')
// const axios = require('axios')

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    if (err) console.log(err);
    console.log(`Breed: ${data}`);
    // /////////////////
    // axios
    //     .get(`https://dog.ceo/api/breed/${data}/images/random`)
    //     .then((response) => {
    //         console.log(response.data.message);
    //     })
    superagent
        .get(`https://dog.ceo/api/breed/${data}/images/random`)
        //When using promise
        .then(res => {
            console.log(res.body.message);
            fs.writeFile('dog-img.txt', res.body.message, (err) => {
                if (err) return console.log(err.message);
                console.log('Random Dog Image saved to File');
            })
        })
        .catch(err => {
            console.log(err.message);
            console.log
        })
    // .end((err, res) => {
    //     if (err) return console.log(err.message);
    //     console.log(res.body.message);

    // });
    ////////////////////////////

    //////////////////////////
    //Async-Await
    // (async ()=> {
    //     try {
    //         const response = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
    //         console.log(response.body.message);
    //     } catch (error) {
    //         console.log(error);
    //     }

    // })()
})