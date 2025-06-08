const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');

exports.signUp = async (req, res) => {
    try {
        const user = await User.create(req.body);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        res.status(201).json({
            status: 'success',
            data: {
                token
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'error',
            err
        })
    }
}

exports.logIn = (req, res) => {
    // 1) get user based on email and check password
    const { email, password } = req.body
    User.findOne({ email })
    // 2) send  token
}