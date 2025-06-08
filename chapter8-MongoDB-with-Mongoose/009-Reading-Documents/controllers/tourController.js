// const fs = require('fs');
const Tour = require('./../models/tourModel');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../../starter/dev-data/data/tours-simple.json`, 'utf-8'));

// PARAM MIDDLEWARE's HANDLER

// exports.checkID = (req, res, next, val) => {
// console.log(`Tour id is: ${val}`);
// if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//         status: 'fail',
//         data: {
//             message: 'Invalid ID'
//         }
//     })
// }
// next();
// }

// exports.checkBody = (req, res, next)=>{
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name or price'
//         })
//     }
//     next();
// } 

// 2) ROUTE HANDLERS for TOURS

exports.getAllTours = async (req, res) => {

    try {
        const tours = await Tour.find();
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }

}
exports.getTour = async (req, res) => {

    try {
        const tour = await Tour.findById(req.params.id);
        
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }

    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour
    //     }
    // })
}
exports.createTour = async (req, res) => {
    console.log(req.body);
    try {
        // const newTour = new Tour({});
        // newTour.save().then()

        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                newTour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!'
        })
    }



    // const newId = tours[tours.length - 1].id + 1
    // console.log(newId);
    // const newTour = Object.assign({ id: newId }, req.body);
    // console.log(newTour);
    // tours.push(newTour);

    // fs.writeFile('../starter/dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
    //     res.status(201).json({
    //         status: 'successs',
    //         data: {
    //             newTour
    //         }
    //     })
    //     console.log('New Item added Successfully!');
    // })

}
exports.updateTour = (req, res) => {
    const id = req.params.id * 1;
    console.log(id);
    // const tour = tours.find(el => el.id === id);

    // if (!tour) {
    //     res.status(404).json({
    //         status: 'fail',
    //         data: {
    //             message: 'Invalid ID'
    //         }
    //     })
    // }
    // const updatedTour = { ...tour, ...req.body }
    // console.log(updatedTour);

    // const tourIndex = tours.findIndex(el => el.id === id);
    // console.log(tour);

    // tours[tourIndex] = updatedTour;

    // fs.writeFile('../starter/dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
    //     res.status(201).json({
    //         status: 'success',
    //         data: {
    //             updatedTour
    //         }
    //     })
    // })

}
exports.deleteTour = (req, res) => {
    const id = req.params.id * 1;

    // const tour = tours.findIndex(el => el.id === id);

    // if (!tourIndex) {
    //     return res.status(204).json({
    //         status: 'fail',
    //         data: {
    //             message: 'Invalid ID'
    //         }
    //     })
    // }

    // const returnDeleteEle = tours.splice(tour, 1)
    // console.log(returnDeleteEle);
    // fs.writeFile('../starter/dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
    //     res.status(200).json({
    //         status: 'success',
    //         data: {
    //             tour
    //         }
    //     })
    // })
}