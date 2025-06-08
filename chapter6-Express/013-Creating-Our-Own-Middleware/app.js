const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json())
// console.log(express.json());

//Creating Our Own MiddleWare 
app.use((req, res, next) => {
    console.log('Hello from middleware👋');
    next();
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})


const tours = JSON.parse(fs.readFileSync('../starter/dev-data/data/tours-simple.json', 'utf-8'));

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

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour)
// app.post('/api/v1/tours', createTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour)

app
    .route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

const port = 8080;
app.listen(port, () => {
    console.log(`server running on ${port}`);
})