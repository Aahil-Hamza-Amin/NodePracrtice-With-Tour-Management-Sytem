const Tour = require('./../models/tourModel');


// 2) ROUTE HANDLERS for TOURS

exports.getAllTours = async (req, res) => {

    try {
        // BUILD QUERY
        //Sallow copy of rq.query 
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])
        // console.log(req.query, queryObj);

        const query = Tour.find(queryObj);
        // USING FILTER OBJECT
        // const tours = await Tour.find({
        //     duration:5,
        //     difficulty: 'easy'
        // });

        // USING MONGOOSE SOECIAL METHODS => (CHAINING)
        // const query = Tour.find()
        //     .where('duration')
        //     .equals(5)
        //     .where('difficulty')
        //     .equals('easy');

        // EXECUTE QUERY
        const tours = await query;

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
            message: err
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
exports.deleteTour = async (req, res) => {
    try {

        await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}