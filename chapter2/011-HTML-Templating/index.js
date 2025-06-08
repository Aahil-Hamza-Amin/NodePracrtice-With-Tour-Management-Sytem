const http = require('http');
const fs = require('fs');
const url = require('url');
const slugify = require('slugify');

const tempReplace = require('./modules/replaceTemplate');

const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
//Creating Slugs=> unique strings
const slugs = dataObj.map(el => slugify(el.productName, { lower: true }))
console.log(slugs);

// console.log(slugify('Fresh Avacado', {lower: true}));

const server = http.createServer((req, res) => {
    // console.log(req.url);
    const { query, pathname } = url.parse(req.url, true);

    //overview page
    if (pathname === '/' || pathname.toLocaleLowerCase() === '/overview') {

        const cardHtml = dataObj.map(el => tempReplace(tempCard, el)).join('');

        const overview = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardHtml);

        res.writeHead(200, {
            'content-type': 'text/html',
        });
        res.write(overview);
        res.end();
    }
    //product page
    else if (pathname.toLocaleLowerCase() === '/product') {
        const product = dataObj[query.id];
        console.log(product);
        const output = tempReplace(tempProduct, product)
        res.writeHead(200, {
            'content-type': 'text/html',
        });
        res.write(output);
        res.end();
    }
    //API
    else if (pathname.toLocaleLowerCase() === '/card') {

        res.writeHead(200, {
            'content-type': 'application/json',
        });
        res.write(data);
        res.end();
    }
    // NOt FOUND 
    else {
        res.writeHead(404, {
            'content-type': 'text/html',
        });
        res.write('Page Not Found!');
        res.end();
    }
})


server.listen(8080, () => {
    console.log('Running on port no. 8080');
})