const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    // .connect(process.env.DATABASE_LOCAL, {
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(con => {
        // console.log(con.connection);
        console.log('DB connection successful');
    })
    .catch(err => {
        console.log(err);
    })
    ;


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`server Running on ${port}`);
})