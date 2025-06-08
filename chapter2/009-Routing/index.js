const http = require('http');
const url = require('url');


const server = http.createServer((req, res) => {
    console.log(req.url);

    const pathName = req.url;

    if (pathName === '/' || pathName.toLocaleLowerCase() === '/overview') {
        res.write('This is the OVERVIEW')
        return res.end();
    } else if (pathName.toLocaleLowerCase() === '/product') {
        res.write('This is the PRODUCT')
        return res.end();
    } else {
        // res.statusCode = 404;
        // res.setHeader('content-type', 'text/html')
        res.writeHead(404, {
            'content-type': 'text/html'
        })

        res.write('<h1>Page not Found!</h1>')
        res.end();
    }


});


server.listen(8080, '127.0.0.1', () => {
    console.log('Listening to request on port 8080');
})