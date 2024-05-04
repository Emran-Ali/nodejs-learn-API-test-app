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
utility.createToken = (len) => {
    const length = typeof len === 'number' && len > 0 ? len : false;
    if (length) {
        const pChar = 'abcdzxrghshf1023456';
        let output = '';
        for (let i = 0; i < length; i += 1) {
            const ch = pChar.charAt(Math.floor(Math.random() * pChar.length));
            output += ch;
        }
        return output;
    }
    return false;
};

module.exports = utility;
