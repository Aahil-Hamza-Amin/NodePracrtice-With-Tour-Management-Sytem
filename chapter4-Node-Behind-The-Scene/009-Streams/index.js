// const fs = require('fs');
// const server = require('http').createServer();

// server.on('request', (req, res) => {
//     // sloution 1 : load whole file into memory first.
//     // fs.readFile('test-file.txt', (err, data) => {
//     //     if (err) console.log(err);
//     //     res.end(data);
//     // })
//     ////////////////////////

//     // solution 2: Streams
    
//     // const readable = fs.createReadStream('test-file.txt');

//     // readable.on('data', chunk=>{
//     //     res.write(chunk);
//     // })
//     // readable.on('end', ()=>{
//     //     res.end();
//     // })
//     // readable.on('error', err=>{
//     //     console.log(err);
//     //     res.statusCode = 500;
//     //     // res.status(500); // it's in express
//     //     res.end('File not Found!')
//     // })

//     // solution 3: pipe method to solve backpressure problem
      
//     const readable = fs.createReadStream('test-file.txt');

//     readable.pipe(res)
// })

// server.listen(8080, '127.0.0.1', () => {
//     console.log('listening...');
// })


