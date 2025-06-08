const fs = require('fs');


const tours = JSON.parse(fs.readFileSync(`${__dirname}/../../starter/dev-data/data/tours-simple.json`, 'utf-8'));

// PARAM MIDDLEWARE's HANDLER

exports.checkID = (req, res, next, val) => {
    console.log(`Tour id is: ${val}`);
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            data: {
                message: 'Invalid ID'
            }
        })
    }
    next();
}

exports.checkBody = (req, res, next)=>{
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        })
    }
    next();
} 

// 2) ROUTE HANDLERS for TOURS

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);

    res.status(200).json({
        status: 'success',
        requestAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    })
}
exports.getTour = (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);
    // // if(req.params.id * 1 > id )
    // if (!tour) {
    //     return res.status(404).json({
    //         status: 'fail',
    //         data: {
    //             message: 'Invalid ID'
    //         }
    //     })
    // }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
}
exports.createTour = (req, res) => {
    console.log(req.body);
    const newId = tours[tours.length - 1].id + 1
    console.log(newId);
    const newTour = Object.assign({ id: newId }, req.body);
    console.log(newTour);
    tours.push(newTour);

    fs.writeFile('../starter/dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'successs',
            data: {
                newTour
            }
        })
        console.log('New Item added Successfully!');
    })

}
exports.updateTour = (req, res) => {
    const id = req.params.id * 1;
    console.log(id);
    const tour = tours.find(el => el.id === id);

    // if (!tour) {
    //     res.status(404).json({
    //         status: 'fail',
    //         data: {
    //             message: 'Invalid ID'
    //         }
    //     })
    // }
    const updatedTour = { ...tour, ...req.body }
    console.log(updatedTour);

    const tourIndex = tours.findIndex(el => el.id === id);
    console.log(tour);

    tours[tourIndex] = updatedTour;

    fs.writeFile('../starter/dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'success',
            data: {
                updatedTour
            }
        })
    })

}
exports.deleteTour = (req, res) => {
    const id = req.params.id * 1;

    const tour = tours.findIndex(el => el.id === id);

    // if (!tourIndex) {
    //     return res.status(204).json({
    //         status: 'fail',
    //         data: {
    //             message: 'Invalid ID'
    //         }
    //     })
    // }

    const returnDeleteEle = tours.splice(tour, 1)
    console.log(returnDeleteEle);
    fs.writeFile('../starter/dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    })
}