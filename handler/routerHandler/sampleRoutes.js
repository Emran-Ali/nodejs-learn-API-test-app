// Sample rout handler

const handler = {};

handler.sampleHnadler = (requestProperty, callback) => {
    callback(200, {
        massage: 'this is sample',
    });
};

module.exports = handler;
