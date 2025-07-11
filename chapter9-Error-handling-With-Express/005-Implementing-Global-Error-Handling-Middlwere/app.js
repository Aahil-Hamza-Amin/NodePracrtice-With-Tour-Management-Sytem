const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/../starter/public`))

// 1) MIDDLEWARE
// Creating Our Own MiddleWare 
// app.use((req, res, next) => {
//     console.log('Hello from middlSeware👋');
//     next();
// })

// app.use((req, res, next) => {
//     req.requestTime = new Date().toISOString();
//     next();
// })

// ROUTES used

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// Handaling Unhandled Routes
app.all('*', (req, res, next) => {
    // return res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server`
    // })

    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.status = 'fail';
    err.statusCode = 404;
    
    next(err);
})

// Implementing Global Error Handling Middlewere
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
    next()
})

module.exports = app;