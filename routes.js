// routing

// dependency
const { sampleHnadler } = require('./handler/routerHandler/sampleRoutes');
const { userHandler } = require('./handler/routerHandler/userHandler');
const { tokenHandler } = require('./handler/routerHandler/tokenHandler');
const { checkHandler } = require('./handler/routerHandler/checkHandler');

const route = {
    sample: sampleHnadler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler,
};

module.exports = route;
