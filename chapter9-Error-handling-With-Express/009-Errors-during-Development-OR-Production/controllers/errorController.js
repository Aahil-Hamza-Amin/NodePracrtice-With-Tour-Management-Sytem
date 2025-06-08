const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
    else {
        // 1) Log Error    
        console.error('Error', err);

        // 2) Send Response      
        res.status(500).json({
            status: 'error',
            message: 'Something bad has Happen!'
        })
    }
}

const golbalErrorHandlingMiddlewere = (err, req, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    }
    else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res)
    }

}

module.exports = golbalErrorHandlingMiddlewere