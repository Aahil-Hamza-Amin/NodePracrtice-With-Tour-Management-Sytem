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
app.use((req, res, next) => {
    console.log('Hello from middlSeware👋');
    next();
})

// app.use((req, res, next) => {
//     req.requestTime = new Date().toISOString();
//     next();
// })

// ROUTES used

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

module.exports = app;