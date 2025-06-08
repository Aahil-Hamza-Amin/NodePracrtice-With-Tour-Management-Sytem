const mongoose = require('mongoose');
const dotenv = require('dotenv').config({ path: './config.env' });

const app = require('./app');
const DB = process.env.DATABASE_URL.replace('<db_password>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(conn => {
    console.log("DATABASE is connected Successfully");
}).catch(err => {
    console.log(err);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening at http://127.0.0.1:${port}`);
})