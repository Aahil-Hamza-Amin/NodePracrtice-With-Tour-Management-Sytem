const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filteredobj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).map(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}

// ROUTE HANDLERS for USER
exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find()

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
})
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This Route is yet not defined'
    })
}
exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This Route is yet not defined'
    })
}

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) check if user provides password or passwordConfirm then through an error
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('Passord is not allowed to update here. Please use /updateMyPassword route to update password', 400))
    }
    // 2) Filtered out unwanted fields that you won't wanted to be updated
    const filteredBody = filteredobj(req.body, 'name', 'email');
    // 3) update the document => we're not using .save because we need to pass all required fields as well 
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: 'success',
        data: {
            updatedUser
        }
    })
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    // 1) Get the User
    const user = await User.findByIdAndUpdate(req.user._id, { active: false });
    console.log(user);

    // 2) Hide that data in result of getAllUsers
    // use queryMiddleware
    // 3) if eveything is ok, Send res
    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This Route is yet not defined'
    })
}
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This Route is not yet defined!'
    })
}