const Tour = require('./../models/tourModel');


// 2) ROUTE HANDLERS for TOURS

exports.getAllTours = async (req, res) => {

    try {
        console.log(req.query);

        // BUILD QUERY
        //Sallow copy of rq.query

        // 1A) FILTERING 
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        // 1B) ADVANCED FILTERING

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // console.log(JSON.parse(queryStr));

        let query = Tour.find(JSON.parse(queryStr));

        //2) SORTING

        if (req.query.sort) {
            sortBy = req.query.sort.split(',').join(' ');
            // console.log(sortBy);
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createAt');
        }

        // 3) Fields LIMITING/PROJECTION

        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields);
        }else{
            query = query.select('-__v')
        }

        // EXECUTE QUERY
        const tours = await query;

        // USING MONGOOSE SOECIAL METHODS => (CHAINING)
        // const query = Tour.find()
        //     .where('duration')
        //     .equals(5)
        //     .where('difficulty')
        //     .equals('easy');
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        })
    } catch (err) {
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