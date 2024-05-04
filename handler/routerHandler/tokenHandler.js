/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
// Sample rout handler

const data = require('../../lib/data');
const { hash, jsonParse, createToken } = require('../../helpers/utility');

const handler = {};

handler.tokenHandler = (requestProperty, callback) => {
  const req = ['get', 'put', 'post', 'delete'];
  if (req.indexOf(requestProperty.method) <= -1) {
    callback(405);
  } else {
    handler._token[requestProperty.method](requestProperty, callback);
  }
};

handler._token = {};

handler._token.post = (requestProperty, callback) => {
  const phone = typeof requestProperty.body.phone === 'string'
    && requestProperty.body.phone.trim().length === 11
      ? requestProperty.body.phone
      : false;
  const password = typeof requestProperty.body.password === 'string'
    && requestProperty.body.password.trim().length > 0
      ? requestProperty.body.password
      : false;
  if (phone && password) {
    data.read('users', phone, (err1, user) => {
      if (err1) {
        callback(400, {
          error: 'Invalid Credential',
        });
      } else {
        const uData = jsonParse(user);
        const reqPass = hash(password);
        if (reqPass === uData.password) {
          const tokenId = createToken(15);
          const expire = Date.now() + 60 * 60 * 1000;
          const tokenOject = {
            id: tokenId,
            expire,
            phone,
          };
          data.create('tokens', tokenId, tokenOject, (err2) => {
            if (err2) {
              callback(500, {
                error: 'There was problem in server side',
              });
            } else {
              callback(200, tokenOject);
            }
          });
        } else {
          callback(400, {
            error: 'password invalid',
          });
        }
      }
    });
  } else {
    callback(400, {
      error: 'Invalid Credential',
    });
  }
};
handler._token.put = (requestProperty, callback) => {
  const token = typeof requestProperty.body.id === 'string'
    && requestProperty.body.id.trim().length === 15
      ? requestProperty.body.id
      : false;
  const extend = typeof requestProperty.body.extend === 'boolean'
      ? requestProperty.body.extend
      : false;
  if (token && extend) {
    data.read('tokens', token, (err, tdata) => {
      if (!err && tdata) {
        const tokenData = jsonParse(tdata);
        tokenData.expire = Date.now() + 60 * 60 * 1000;
        data.update('tokens', token, tokenData, (errU) => {
          if (errU) {
            callback(200, {
                massage: 'OK , Update',
            });
          } else {
            callback(400, {
                error: ` OPPSS! Cant${errU}`,
            });
          }
        });
      } else {
        callback(400, {
          error: 'toke Not Found',
        });
      }
    });
  } else {
    callback(500, {
      error: 'invalid request',
    });
  }
};
handler._token.get = (requestProperty, callback) => {
  const token = typeof requestProperty.queryString.token === 'string'
    && requestProperty.queryString.token.trim().length === 15
      ? requestProperty.queryString.token
      : false;
  if (token) {
    data.read('tokens', token, (err, tData) => {
      if (!err && tData) {
        const tokenData = { ...jsonParse(tData) };

        callback(200, tokenData);
      } else {
        callback(404, {
          error: 'token not found',
        });
      }
    });
  } else {
    callback(404, {
      error: 'not valid token',
    });
  }
};
handler._token.delete = (requestProperty, callback) => {
    const token = typeof requestProperty.queryString.token === 'string'
      && requestProperty.queryString.token.trim().length === 15
        ? requestProperty.queryString.token
        : false;
    if (token) {
        data.read('tokens', token, (err, tData) => {
            if (!err && tData) {
                data.delete('tokens', token, (err1) => {
                    if (err1) {
                        callback(200, {
                            massage: 'succeFully Deleted',
                        });
                    } else {
                        callback(500, {
                            error: `OPPs ${err}`,
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'Token not found',
                });
            }
        });
    } else {
        callback(400, {
            error: 'Invalid Token',
        });
    }
};
handler._token.varify = (id, phone, callback) => {
    data.read('tokens', id, (err, tdata) => {
        if (!err && tdata) {
            if (jsonParse(tdata).phone === phone && jsonParse(tdata).expire > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

module.exports = handler;
