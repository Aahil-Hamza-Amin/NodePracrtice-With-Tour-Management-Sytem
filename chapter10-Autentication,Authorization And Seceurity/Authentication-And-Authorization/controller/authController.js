const User = require('./../models/userModel');

exports.signUp = async (req, res, next) => {
    try {

        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            pic: req.body.pic
        })

        res.status(200).json({
            status: 'success',
            data: {
                newUser
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'error',
            data: {
                error
            }
        })
    }
}