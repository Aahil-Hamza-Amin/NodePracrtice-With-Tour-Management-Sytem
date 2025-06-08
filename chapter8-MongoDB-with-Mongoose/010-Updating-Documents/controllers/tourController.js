const Tour = require('./../models/tourModel');


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
}
exports.updateTour = async (req, res) => {

    try {

        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(201).json({
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