const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
}

if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

const createSignToken = (user, statusCode, res) => {
    const token = signToken(user._id)

    res.cookie('jwt', token, cookieOptions)
    // Remove password from output while signUP 
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.signUp = catchAsync(async (req, res, next) => {
    // const newUser = await User.create(req.body); // issue: Anyone can register as admin
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
    });

    // Create A Token
    createSignToken(newUser, 201, res);
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
    createSignToken(user, 200, res)

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

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get the users with Posted email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError('There is no user with the email address.', 404))
    }
    // 2) A random Token is generated
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false })
    // 3) Token is send to the user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot Your Password? Please do a Patch request with a new password and passwordConfirm at ${resetURL}.\n If You dont forgot password Ignore this Email!`;

    try {

        await sendEmail({
            email: user.email,
            subject: 'Your password reset Token (valid for 10min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'token is sent to email'
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was error sending an email. Try again lator!', 500))
    }

})

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get the user based on Token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    })

    if (!user) {
        return next(new AppError('The Token is invalid or has Expired!', 400))
    }
    // 2) if the token is not expired, user exists, set new password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    // 3) update changePasswordAfter Time, So we get the record when password has been changed
    // Here we use Document Middleware that runs before actual saving of document
    // 4) Send the JWT token to the Client/user
    createSignToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get the user, as he has already logged in, and its a protected route as well 
    const user = await User.findById(req.user._id).select("+password");
    // 2) Check the current Password is correct
    if (!user || !(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('The current password is wrong', 401));
    }
    // 3) if so, update the password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // 4) if everthings okay, send the JWT
    createSignToken(user, 200, res);
});