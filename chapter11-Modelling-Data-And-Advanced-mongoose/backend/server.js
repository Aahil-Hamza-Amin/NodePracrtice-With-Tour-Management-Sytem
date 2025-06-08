const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE_URL.replace('<db_password>', process.env.DATABASE_PASSWORD);

(async () => {
    try {
        await mongoose.connect(DB);
        console.log('DB Connection Successful');
    } catch (err) {
        console.log('Error', err);
    }
})();

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running at ${port}`);
})
