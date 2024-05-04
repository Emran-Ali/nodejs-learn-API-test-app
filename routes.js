// routing

// dependency
const { sampleHnadler } = require('./handler/routerHandler/sampleRoutes');
const { userHandler } = require('./handler/routerHandler/userHandler');

const route = {
    sample: sampleHnadler,
    user: userHandler,
};

module.exports = route;
