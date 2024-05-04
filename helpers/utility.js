// for utility type task
const cripto = require('crypto');
const environment = require('./environments');

const utility = {};

// json string to Object
utility.jsonParse = (jsonString) => {
    let output = {};
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};

utility.hash = (pass) => {
    if (pass && pass.length > 0) {
        const hash = cripto.createHmac('sha256', environment.key).update(pass).digest('hex');
        return hash;
    }
    return false;
};

module.exports = utility;
