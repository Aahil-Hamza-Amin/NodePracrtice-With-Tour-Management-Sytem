const AppError = require("../utils/appError");

const handleCasteErrorDB = err => {
    console.log(err);
    
    const message = `Invalid ${err.path} ${err.value}`;
    return new AppError(message, 400)
}

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
        console.log('Inside of Operational Error');
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
    else {
        console.log('Inside Programing Error');
        // 1) Log Error    
        console.error('Error', err);

        // 2) Send Response      
        res.status(500).json({
            error: err,
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
        let error = { ...err };
        console.log(err);
        
        if (error.name === 'CastError') error = handleCasteErrorDB(error)
        // if(error.code === 11000) error = handleDuplicateFieldsDB(error)
        sendErrorProd(error, res)
    }

}

module.exports = golbalErrorHandlingMiddlewere