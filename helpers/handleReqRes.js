/* eslint-disable no-param-reassign */
// Handle request and response

// dependency
const url = require('url');
const { StringDecoder } = require('string_decoder');
const route = require('../routes');
const { notFound } = require('../handler/routerHandler/notFoundHandler');

const handler = {};

handler.handleReqRes = (req, res) => {
    // handle req object
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname.replace(/^\/+|\$/g, '');

    const method = req.method.toLowerCase();
    const queryString = parsedUrl.query;
    const { headers } = req;
    const requestProperty = {
        parsedUrl,
        path,
        method,
        queryString,
        headers,
    };
    const decoder = new StringDecoder('utf-8');

    const chosenHandler = route[path] ? route[path] : notFound;

    let bodyData = '';
    req.on('data', (buffer) => {
        bodyData += decoder.write(buffer);
    });
    req.on('end', () => {
        bodyData += decoder.end();
        console.log(bodyData);
        chosenHandler(requestProperty, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : '500';
            payload = typeof payload === 'object' ? payload : {};
            res.writeHead(statusCode);
            res.end(JSON.stringify(payload));
        });
    });
};

module.exports = handler;
