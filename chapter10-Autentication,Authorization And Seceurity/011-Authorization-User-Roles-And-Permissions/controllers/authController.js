const jwt = require('jsonwebtoken');
const { promisify } = require('util');
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
        passwordChangedAt: req.body.passwordChangedAt
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
        // console.log(token);
    }
    if (!token) {
        return next(new AppError('You are not logged In! Please log in to get access.!', 401))
    }
    //2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);

    //3) check still user exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user dose not exists! please login Again.!', 401))
    }
    //4) Check user has changed passward after token has been 
    if (currentUser.passwordChangedAfter(decoded.iat)) {
        return next(new AppError('Password has been changed recently, Please login again!', 401))
    }

    req.user = currentUser;
    next()
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array => ['admin', 'user', 'guide', 'lead-guide'] => role = 'user'
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You dont have permission to perform this action', 403));
        }

        next();
    }
}