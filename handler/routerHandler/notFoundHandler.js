// Sample rout handler

const handler = {};

handler.notFound = (requestProperty, callback) => {
    callback(404, {
        massage: 'this is not Found',
    });
};

module.exports = handler;
