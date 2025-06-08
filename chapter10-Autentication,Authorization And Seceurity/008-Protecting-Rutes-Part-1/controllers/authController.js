const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signUp = catchAsync(async (req, res, next) => {
    // const newUser = await User.create(req.body); // issue: Anyone can register as admin
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    // Create A Token

    const token = signToken(newUser._id)

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
});

exports.login = catchAsync(async (req, res, next) => {
    // 1) check if email and password exists
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please enter email and password!', 400))
    }
    // 2) check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    // hamza123=$2b$14$vN7Bp2zpYv5zc9mh/6Z6ee4Oj.RP.zvxNPtcJ/WEsNkMoJQUO.zNu

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Email or password is Incorrect!'))
    }
    // 3) if everything ok: send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
})

exports.protect = catchAsync(async (req, res, next) => {
    // 1) getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log(token);
    }
    if (!token) {
        return next(new AppError('You are not logged In! Please log in to get access.!', 401))
    }
    
    next()
});