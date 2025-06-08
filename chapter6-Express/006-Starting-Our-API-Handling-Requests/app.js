
const fs = require('fs');
const express = require('express');

const app = express();

// app.get('/', (req, res) => {
//     res
//         .status(200)
//         .json({
//             message: 'Hello from the Server side!',
//             app: 'Natours'
//         }) 
// })

const tours = JSON.parse(
    fs.readFileSync(`../starter/dev-data/data/tours-simple.json`, 'utf-8')
);

app.get('/api/v1/tours', (req, res) => {
    res
        .status(200)
        .json(
            {
                status: 'success',
                results: tours.length,
                data: {
                    tours
                }
            }
        )
})

app.post('/', (req, res) => {
    res.send('You can post to this endpoint...')
})

const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}...`);
})

// const fs = require('fs');
// const express = require('express');

// const app = express();
// app.use(express.json());

// const tours = JSON.parse(
//     fs.readFileSync(`../starter/dev-data/data/tours-simple.json`, 'utf-8')
// );

// app.get('/api/v1/tours', (req, res) => {
//     res
//         .status(200)
//         .json(
//             {
//                 status: 'success',
//                 results: tours.length,
//                 data: {
//                     tours
//                 }
//             }
//         )
// })

// app.post('/api/v1/tours', (req, res) => {
//     console.log(req.body);
//     res.send('Done');
// })

// const port = 3000;
// app.listen(port, () => {
//     console.log(`App is running on port ${port}...`);
// })