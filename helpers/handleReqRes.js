// Handle request and response

// dependency
const url = require('url');
const { StringDecoder } = require('string_decoder');
const route = require('../routes');
const { notFound } = require('../handler/routerHandler/notFoundHandler');

const handler = {};

handler.handleReqRes = (req, res) => {
    // handle req
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname.replace(/^\/+|\$/g, '');
    console.log(path);
    if (path === 'about') {
        console.dir(route.sample);
        route.sample();
    } else {
        notFound();
    }

    const method = req.method.toLowerCase();
    const queryString = parsedUrl.query;
    const { headers } = req;

    const decoder = new StringDecoder('utf-8');
    let bodyData = '';
    req.on('data', (buffer) => {
        bodyData += decoder.write(buffer);
    });
    req.on('end', () => {
        bodyData += decoder.end();
        console.log(bodyData);
    });
    res.end('Server OK then 2nd');
};

module.exports = handler;
