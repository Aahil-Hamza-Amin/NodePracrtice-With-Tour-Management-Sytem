const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.deleteOne = Model => {

    return catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id)

        if (!doc) {
            return next(new AppError('No Document was Found with That ID', 404))
        }

        res.status(204).json({
            status: 'success',
            data: null
        })
    })
}

exports.updateOne = Model => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if (!doc) {
            return next(new AppError('No document was Found with That ID', 404))
        }

        res.status(201).json({
            status: 'success',
            data: {
                doc
            }
        })
    })
}