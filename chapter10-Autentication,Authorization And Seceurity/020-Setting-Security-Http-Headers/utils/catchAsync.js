// Using AsyncFunc to avoid using try-catch block and hadle catch errors in async function
const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(error => next(error))
    }
}

module.exports = catchAsync;