const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })
const Tour = require('../models/tourModel');

// require('./../../dev-data/data/tours.json')

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
    });

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../../dev-data/data/tours.json`, 'utf-8'));

// IMPORT DATA INTO DB

const importData = async () => {
    try {
        await Tour.create(tours)
        console.log('data Successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

// DELETE ALL ALREADY DATA FROM DB

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('data Successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

// console.log(process.argv);