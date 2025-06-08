const http = require('http');
const url = require('url');
const fs = require('fs');
const data = fs['readFileSync'](`${__dirname}/dev-data/data.json`, 'utf-8');
const productData = JSON.parse(data);
const server = http['createServer']((req, res) => {
    console.log(req.url);

    const pathName = req.url;
    if (pathName === '/' || pathName === '/overview') {
        res['end']("This is Overview");
    }
    else if (pathName === '/product') {
        res['end']("This is Product");
    }
    else if (pathName === '/api') {

        res['writeHead'](200, {
            'content-type': 'application/json'
        })
        res['end'](JSON.stringify(productData[2]));

    }
    else {
        res['writeHead'](404, {
            'content-type': 'text/html'
        })
        res['end']("<h1>Page is Found!</h1>")
    }
}
);

server['listen'](8080, '127.0.0.1', () => {
    console.log("server is lIstening on port No. 8080");
})