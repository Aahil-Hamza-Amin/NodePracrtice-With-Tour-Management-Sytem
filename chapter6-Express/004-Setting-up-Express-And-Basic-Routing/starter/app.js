const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res
        .status(200)
        .json({
            message: 'Hello from the Server side!',
            app: 'Natours'
        }) 
})

app.post('/', (req, res)=>{
    res.send('You can post to this endpoint...')
})

const port = 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}...`);
})