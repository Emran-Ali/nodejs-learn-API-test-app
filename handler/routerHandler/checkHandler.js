/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
// Sample rout handler

const data = require('../../lib/data');
const { jsonParse, createToken } = require('../../helpers/utility');
const tokenHandler = require('./tokenHandler');

const handler = {};

handler.checkHandler = (requestProperty, callback) => {
  const req = ['get', 'put', 'post', 'delete'];
  if (req.indexOf(requestProperty.method) <= -1) {
    callback(405);
  } else {
    handler._check[requestProperty.method](requestProperty, callback);
  }
};

handler._check = {};

handler._check.post = (requestProperty, callback) => {
  const protocol = typeof requestProperty.body.protocol === 'string'
    && ['http', 'https'].indexOf(requestProperty.body.protocol) > -1
      ? requestProperty.body.protocol
      : false;
  const url = typeof requestProperty.body.url === 'string'
    && requestProperty.body.url.trim().length > 0
      ? requestProperty.body.url
      : false;
  const method = typeof requestProperty.body.method === 'string'
    && ['get', 'put', 'post', 'delete'].indexOf(requestProperty.body.method) > -1 ? requestProperty.body.method : false;

  const successCode = typeof requestProperty.body.successCode === 'object'
    && requestProperty.body.successCode instanceof Array ? requestProperty.body.successCode : false;

  const timeOutSec = typeof requestProperty.body.timeOutSec === 'number'
    && requestProperty.body.timeOutSec % 1 === 0
    && requestProperty.body.timeOutSec >= 1
    && requestProperty.body.timeOutSec <= 5 ? requestProperty.body.timeOutSec : false;

  if (protocol && url && method && successCode && timeOutSec) {
    const token = typeof requestProperty.headers.token === 'string'
        ? requestProperty.headers.token : false;
    data.read('tokens', token, (err1, tokenData) => {
      if (err1) {
        callback(403, {
          error: 'Authentication problem',
        });
      } else {
        const { phone } = jsonParse(tokenData);
        data.read('users', phone, (err2, userData) => {
          if (err2) {
            callback(400, {
              error: 'User not found',
            });
          } else {
            tokenHandler._token.varify(token, phone, (isValid) => {
              if (isValid) {
                  const userObject = jsonParse(userData);
                  const userChecks = typeof userData.checks === 'object' && userData.checks instanceof Array ? userData.checks : [];
                  if (userChecks.length < 5) {
                    const checkId = createToken(12);
                    const checkObject = {
                      id: checkId,
                      phone,
                      protocol,
                      url,
                      method,
                      timeOutSec,
                      successCode,
                    };
                    data.create('checks', checkId, checkObject, (err3) => {
                      if (err3) {
                        callback(500, {
                          error: 'fail to create check object',
                        });
                      } else {
                        // add check id to user object
                        userObject.checks = userChecks;
                        userObject.checks.push(checkId);
                        console.log('pusgh');
                        data.update('users', phone, userObject, (err4) => {
                          console.log(err4, 'err');
                          if (err4) {
                            callback(500, {
                              error: 'Cant update user data',
                            });
                          } else {
                            callback(200, checkObject);
                          }
                        });
                      }
                    });
                  } else {
                    callback(401, {
                      error: 'User check limit Over',
                    });
                  }
              } else {
                callback(400, {
                  error: 'Invalid token',
                });
              }
            });
          }
        });
      }
    });
  } else {
    callback(400, {
      error: 'Problem in your request',
    });
  }
};
handler._check.put = (requestProperty, callback) => {
  const token = typeof requestProperty.body.id === 'string'
    && requestProperty.headers.token.trim().length > 1
      ? requestProperty.headers.token
      : false;
  const id = typeof requestProperty.body.id === 'string'
    && requestProperty.body.id.trim().length === 12
      ? requestProperty.body.id
      : false;
  const protocol = typeof requestProperty.body.protocol === 'string'
    && ['http', 'https'].indexOf(requestProperty.body.protocol) > -1
      ? requestProperty.body.protocol
      : false;
  const url = typeof requestProperty.body.url === 'string'
    && requestProperty.body.url.trim().length > 0
      ? requestProperty.body.url
      : false;
  const method = typeof requestProperty.body.method === 'string'
    && ['get', 'put', 'post', 'delete'].indexOf(requestProperty.body.method) > -1
      ? requestProperty.body.method
      : false;

  const successCode = typeof requestProperty.body.successCode === 'object'
    && requestProperty.body.successCode instanceof Array
      ? requestProperty.body.successCode
      : false;

  const timeOutSec = typeof requestProperty.body.timeOutSec === 'number'
    && requestProperty.body.timeOutSec % 1 === 0
    && requestProperty.body.timeOutSec >= 1
    && requestProperty.body.timeOutSec <= 5
      ? requestProperty.body.timeOutSec
      : false;

    if (id) {
       if (protocol || url || method || successCode || timeOutSec) {
        data.read('checks', id, (err1, cData) => {
          if (err1) {
            callback(404, {
              error: 'File Not found',
            });
          } else {
            const checkData = jsonParse(cData);
            tokenHandler._token.varify(token, checkData.phone, (isValid) => {
              console.log(isValid);
              if (isValid) {
                console.log(token);
                  if (protocol) {
                    checkData.protocol = protocol;
                  }
                  if (url) {
                    checkData.url = url;
                  }
                  if (method) {
                    checkData.method = method;
                  }
                  if (successCode) {
                    checkData.successCode = successCode;
                  }
                  if (timeOutSec) {
                    checkData.timeOutSec = timeOutSec;
                  }
                  data.update('checks', id, checkData, (err) => {
                    if (err) {
                      callback(500, {
                        error: 'Fail to update data',
                      });
                    } else {
                      callback(200, checkData);
                    }
                  });
                } else {
                callback(403, {
                  error: 'Authentication Error',
                });
              }
            });
          }
        });
       } else {
        callback(400, {
          error: 'Nothing to update',
        });
       }
    } else {
      callback(500, {
        error: 'Invalid request',
      });
    }
};
handler._check.get = (requestProperty, callback) => {
  const id = typeof requestProperty.queryString.id === 'string'
    && requestProperty.queryString.id.trim().length === 12
      ? requestProperty.queryString.id
      : false;

      if (id) {
        data.read('checks', id, (err, cData) => {
          if (err) {
            callback(404, {
              error: 'Check ID not found',
            });
          } else {
            const token = typeof requestProperty.headers.token === 'string'
                ? requestProperty.headers.token
                : false;
            const checkData = jsonParse(cData);
            tokenHandler._token.varify(token, checkData.phone, (isVslid) => {
              if (isVslid) {
                callback(200, checkData);
              } else {
                callback(403, {
                  error: 'Unauthorize token',
                });
              }
            });
          }
        });
      } else {
        callback(404, {
        error: 'Problem in request',
        });
  }
};
handler._check.delete = (requestProperty, callback) => {
      const token = typeof requestProperty.headers.token === 'string'
        && requestProperty.headers.token.trim().length > 1
          ? requestProperty.headers.token
          : false;
      const id = typeof requestProperty.body.id === 'string'
        && requestProperty.body.id.trim().length === 12
          ? requestProperty.body.id
          : false;
  if (id) {
    data.read('checks', id, (err, cData) => {
      if (!err && cData) {
        if (token) {
          tokenHandler._token.varify(token, jsonParse(cData).phone, (isVslid) => {
            if (isVslid) {
              data.delete('checks', id, (err1) => {
                if (err1) {
                  callback(200, {
                    massage: 'Check succeFully Deleted',
                  });
                } else {
                  callback(500, {
                    error: `OPPs ${err}`,
                  });
                }
              });
            } else {
              callback(403, {
                error: 'Unauthorize token',
              });
            }
          });
        } else {
          callback(403, {
            massage: 'Unauthorize request',
          });
        }
      } else {
        callback(500, {
          error: 'Token not found',
        });
      }
    });
  } else {
    callback(400, {
      error: 'Invalid request',
    });
  }
};

module.exports = handler;
