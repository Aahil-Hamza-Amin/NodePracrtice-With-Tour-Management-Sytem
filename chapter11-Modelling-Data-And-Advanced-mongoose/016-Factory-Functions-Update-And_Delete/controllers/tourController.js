const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const factory = require('./handlerFactory');
// 2) ROUTE HANDLERS for TOURS

exports.aliasTopTour = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getAllTours = catchAsync(async (req, res, next) => {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const tours = await features.query;

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

})
exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id).populate('reviews').lean();


    if (!tour) {
        return next(new AppError('No Tour was Found with That ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})
exports.createTour = catchAsync(async (req, res, next) => {
    // console.log(req.body);

    // const newTour = new Tour({});
    // newTour.save().then()

    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            newTour
        }
    })
})
exports.updateTour = factory.updateOne(Tour);
// exports.updateTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//     })

//     if (!tour) {
//         return next(new AppError('No Tour was Found with That ID', 404))
//     }

//     res.status(201).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     })
// })
exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndDelete(req.params.id)

//     if (!tour) {
//         return next(new AppError('No Tour was Found with That ID', 404))
//     }

//     res.status(204).json({
//         status: 'success',
//         data: null
//     })
// })

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: {
                ratingsAverage: { $gte: 4.5 }
            }
        },
        {
            $group: {
                // _id: '$ratingsAverage',
                _id: { $toUpper: '$difficulty' },
                numTours: {
                    $sum: 1
                }
                ,
                numRatings: {
                    $sum: '$ratingsQuantity'
                },
                avgRatings: { $avg: '$ratingsAverage' }, avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        },
        // {
        //     $match: { _id: { $ne: 'EASY' } }
        // }
    ])

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: { _id: 0 }
        },
        { $sort: { numTourStarts: -1 } },
        {
            $limit: 12
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    })
})


// The below code is copied from the Above
// exports.getAllTours = async (req, res) => {

//     try {
//         // console.log(req.query);

//         // // BUILD QUERY
//         // //Sallow copy of rq.query

//         // // 1A) FILTERING
//         // const queryObj = { ...req.query };
//         // const excludedFields = ['page', 'sort', 'limit', 'fields']
//         // excludedFields.forEach(el => delete queryObj[el])

//         // // 1B) ADVANCED FILTERING

//         // let queryStr = JSON.stringify(queryObj);
//         // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

//         // // console.log(JSON.parse(queryStr));

//         // let query = Tour.find(JSON.parse(queryStr));

//         //2) SORTING
//         // if (req.query.sort) {
//         //     sortBy = req.query.sort.split(',').join(' ');
//         //     // console.log(sortBy);
//         //     query = query.sort(sortBy);
//         // } else {
//         //     query = query.sort('-createAt');
//         // }

//         // 3) Fields LIMITING/PROJECTION

//         // if (req.query.fields) {
//         //     const fields = req.query.fields.split(',').join(' ')
//         //     query = query.select(fields);
//         // } else {
//         //     query = query.select('-__v')
//         // }

//         // PAGINATION
//         // const page = req.query.page * 1 || 1;
//         // const limit = req.query.limit * 1 || 100;
//         // const skip = (page - 1) * limit;

//         // // page=2&limit=10
//         // // 1-10 => page 1
//         // // 11-20 => page 2, so on

//         // query = query.skip(skip).limit(limit);

//         // if (req.query.page) {
//         //     const numTours = await Tour.countDocuments();
//         //     if (skip >= numTours) throw new Error("This Page does not exist");
//         // }

//         // EXECUTE QUERY
//         const features = new APIFeatures(Tour.find(), req.query)
//             .filter()
//             .sort()
//             .limitFields()
//             .paginate();

//         const tours = await features.query;

//         // USING MONGOOSE SOECIAL METHODS => (CHAINING)
//         // const query = Tour.find()
//         //     .where('duration')
//         //     .equals(5)
//         //     .where('difficulty')
//         //     .equals('easy');
//         res.status(200).json({
//             status: 'success',
//             results: tours.length,
//             data: {
//                 tours
//             }
//         })
//     } catch (err) {

//         res.status(404).json({
//             status: 'fail',
//             message: err
//         })
//     }

// }