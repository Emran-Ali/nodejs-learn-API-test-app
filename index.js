// Title: Uptime monitoring System
// A restfull API to monitor up or down time of user define links

// Dependency
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');

const app = {};

// configaration
app.config = {
    port: 3000,
};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`Listening at por ${app.config.port}`);
    });
};

// handle request response
app.handleReqRes = handleReqRes;

app.createServer();
