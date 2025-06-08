const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
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