const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

const tours = JSON.parse(
    fs.readFileSync(`../starter/dev-data/data/tours-simple.json`, 'utf-8')
);
// for all tours data
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
// for 1 specific tour data using id
app.get('/api/v1/tours/:id', (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id)

    // if (id > tours.length) { or 
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res
        .status(200)
        .json(
            {
                status: 'success',
                data: {
                    tour
                }
            }
        )
})

app.post('/api/v1/tours', (req, res) => {
    // console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body)
    tours.push(newTour)
    fs.writeFile(`../starter/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
})

app.patch('/api/v1/tours/:id', (req, res) => {
    // if (!tour) {
    // or 
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<updated tour Here...>'
        }
    })
})
app.delete('/api/v1/tours/:id', (req, res) => {
    // if (!tour) {
    // or 
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    res.status(204).json({
        status: 'success',
        data: {
            tour: null
        }
    })
})

const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}...`);
})