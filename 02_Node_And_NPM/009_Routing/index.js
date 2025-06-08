const http = require('http');
const url = require('url');

// api || endpoint || route/routing || path || url
const server = http['createServer']((req, res) => {
    const pathName = req.url;

    if (pathName === '/' || pathName === '/overview') {
        res.end('This is Overview');
    }
    else if (pathName === '/product') {
        res.end('This is Product');
    }
    else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'hello world'
        });
        res.end('<h1>Page not Found!</h1>')
    }
});

server['listen'](8080, '127.0.0.1', () => {
    console.log('Server is Listening on port no. 8080');
});