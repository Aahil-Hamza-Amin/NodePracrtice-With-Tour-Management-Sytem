const fs = require('fs');
const express = require('express');
const morgan = require('morgan')

const app = express();

app.use(morgan('dev'));

app.use(express.json());
// console.log(express.json());

// 1) MIDDLEWARE
//Creating Our Own MiddleWare 
app.use((req, res, next) => {
    console.log('Hello from middlSeware👋');
    next();
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})


const tours = JSON.parse(fs.readFileSync('../starter/dev-data/data/tours-simple.json', 'utf-8'));

// 2) ROUTE HANDLERS for TOURS

const getAllTours = (req, res) => {
    console.log(req.requestTime);

    res.status(200).json({
        status: 'success',
        requestAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    })
}
const getTour = (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);
    // if(req.params.id * 1 > id )
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            data: {
                message: 'Not Found'
            }
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
}
const createTour = (req, res) => {
    console.log(req.body);
    const newId = tours[tours.length - 1].id + 1
    console.log(newId);
    const newTour = Object.assign({ id: newId }, req.body);
    console.log(newTour);
    tours.push(newTour);

    fs.writeFile('../starter/dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'successs',
            data: {
                newTour
            }
        })
        console.log('New Item added Successfully!');
    })

}
const updateTour = (req, res) => {
    const id = req.params.id * 1;
    console.log(id);
    const tour = tours.find(el => el.id === id);

    if (!tour) {
        res.status(404).json({
            status: 'fail',
            data: {
                message: 'Entered Wrong tour No.'
            }
        })
    }
    const updatedTour = { ...tour, ...req.body }
    console.log(updatedTour);

    const tourIndex = tours.findIndex(el => el.id === id);
    console.log(tour);

    tours[tourIndex] = updatedTour;

    fs.writeFile('../starter/dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'success',
            data: {
                updatedTour
            }
        })
    })

}
const deleteTour = (req, res) => {
    const id = req.params.id * 1;

    const tourIndex = tours.findIndex(el => el.id === id);

    if (!tourIndex) {
        return res.status(204).json({
            status: 'fail',
            data: {
                message: 'Element not Found!'
            }
        })
    }

    const returnDeleteEle = tours.splice(tourIndex, 1)
    console.log(returnDeleteEle);
    fs.writeFile('../starter/dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
        res.status(200).json({
            status: 'success',
            data: {
                tourIndex
            }
        })
    })
}

// ROUTE HANDLERS for USER

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This Route is yet not defined'
    })
}
const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This Route is yet not defined'
    })
}
const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This Route is yet not defined'
    })
}
const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This Route is yet not defined'
    })
}
const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This Route is not yet defined!'
    })
}

// ROUTERS 
const tourRouter = express.Router();
const userRouter = express.Router();
// 3) ROUTES for TOURS


tourRouter.route('/')
    .get(getAllTours)
    .post(createTour)

tourRouter.route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

userRouter.route('/')
    .get(getAllUsers)
    .post(createUser)

// ROUTES for USERS

userRouter.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

const port = 8080;
app.listen(port, () => {
    console.log(`server running on ${port}`);
})