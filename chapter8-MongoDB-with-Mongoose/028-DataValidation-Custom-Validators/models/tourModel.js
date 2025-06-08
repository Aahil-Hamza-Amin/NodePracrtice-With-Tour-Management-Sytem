const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');



const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A Tour name must have length of less than or equal to 40 characters'],
        minlength: [10, 'A Tour name must have length of greater than or equal to 10 characters'],
        // validate: {
        //     validator: validator.isAlpha,
        //     message: 'The Tour name should only contains strings'
        // }
        validate: [validator.isAlpha, 'The Tour name should only contains strings']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'difficult', 'medium'],
            message: 'Difficulty is either easy, medium or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        max: [5, 'A Tour must have a ratingsAverage of less than or equa to 5'],
        min: [0, 'A Tour must have a ratingsAverage of more than or equa to 0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    }
    ,
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                // this points to the current doc  that worked only in case of saving NEW doc
                return val < this.price // 250 < 200 => get false => won't saved
            },
            message: 'priceDiscounted ({VALUE})shold be less than regular Price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createAt: {
        type: Date,
        default: Date.now(),
        select: false //hidding metadata, for security, won't see createdAt Feild in results
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
})

// DOCUMENT MIDDLEWARE: before the actual event; .save() and .create()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next();
})

tourSchema.pre('save', function (next) {
    console.log('will document processed....');
    next();
})

tourSchema.pre(/^find/, function (next) {
    // tourSchema.pre('find', function (next) {
    this.find({ secretTour: { $ne: true } });
    this.starts = Date.now();
    next();
})

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took time ${Date.now() - this.starts} milliseconds!`);
    console.log(docs);
    next()
})

// Run when all pre hooks completed
// tourSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next();
// })

tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
    console.log(this.pipeline());
    next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;