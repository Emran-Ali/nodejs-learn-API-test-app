// routing

// dependency
const { sampleHnadler } = require('./handler/routerHandler/sampleRoutes');
const { userHandler } = require('./handler/routerHandler/userHandler');
const { tokenHandler } = require('./handler/routerHandler/tokenHandler');

const route = {
    sample: sampleHnadler,
    user: userHandler,
    token: tokenHandler,
};

module.exports = route;
