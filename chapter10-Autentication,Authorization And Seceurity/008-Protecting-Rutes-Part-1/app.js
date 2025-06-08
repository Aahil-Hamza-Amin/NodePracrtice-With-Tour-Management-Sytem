const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const AppError = require('./utils/appError');
const golbalErrorHandlingMiddlewere = require('./controllers/errorController')
const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));

}

app.use(express.json());
app.use(express.static(`${__dirname}/../starter/public`))

// 1) MIDDLEWARE
// Creating Our Own MiddleWare 
// app.use((req, res, next) => {
//     console.log(req.headers)
//     console.log('Hello from middlSeware👋');
//     next();
// })

app.use((req, res, next) => {
    console.log(req.headers)
    req.requestTime = new Date().toISOString();
    next();
})

// ROUTES used

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// Handaling Unhandled Routes
app.all('*', (req, res, next) => {

    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.status = 'fail';
    // err.statusCode = 404;
    // next(err);

    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

// Implementing Global Error Handling Middlewere
app.use(golbalErrorHandlingMiddlewere)

module.exports = app;