// Title: Uptime monitoring System
// A restfull API to monitor up or down time of user define links

// Dependency
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environments = require('./helpers/environments');

const app = {};

// @TODO: test
// fileLib.delete('test', 'test', (err) => {
//     console.log(err);
// });

// configaration

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environments.port, () => {
        console.log(`Listening at por ${environments.port}`);
    });
};

// handle request response
app.handleReqRes = handleReqRes;

app.createServer();
