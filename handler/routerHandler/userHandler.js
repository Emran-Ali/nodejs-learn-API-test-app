/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
// Sample rout handler

const data = require('../../lib/data');
const { hash, jsonParse } = require('../../helpers/utility');
const varify = require('./tokenHandler');

const handler = {};

handler.userHandler = (requestProperty, callback) => {
  const req = ['get', 'put', 'post', 'delete'];
  if (req.indexOf(requestProperty.method) <= -1) {
    callback(405);
  } else {
    handler._user[requestProperty.method](requestProperty, callback);
  }
};

handler._user = {};

handler._user.post = (requestProperty, callback) => {
  const firstName = typeof requestProperty.body.firstName === 'string'
    && requestProperty.body.firstName.trim().length > 0
      ? requestProperty.body.firstName
      : false;
  const lastName = typeof requestProperty.body.lastName === 'string'
    && requestProperty.body.lastName.trim().length > 0
      ? requestProperty.body.lastName
      : false;
  const phone = typeof requestProperty.body.phone === 'string'
    && requestProperty.body.phone.trim().length === 11
      ? requestProperty.body.phone
      : false;
  const password = typeof requestProperty.body.password === 'string'
    && requestProperty.body.password.trim().length > 0
      ? requestProperty.body.password
      : false;
  if (firstName && lastName && phone && password) {
    data.read('users', phone, (err1) => {
      if (err1) {
        const userData = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgrement: requestProperty.body.tosAgrement,
        };
        data.create('users', phone, userData, (err) => {
          if (err) {
            callback(500, {
              error: 'error in creat user',
            });
          } else {
            callback(200, {
              massage: 'user created sucessfully',
            });
          }
        });
      } else {
        callback(500, {
          error: 'there is a problem , user may exist',
        });
      }
    });
  } else {
    callback(500, {
      error: 'Problem in your request',
    });
  }
};
handler._user.put = (requestProperty, callback) => {
  const firstName = typeof requestProperty.body.firstName === 'string'
    && requestProperty.body.firstName.trim().length > 0
      ? requestProperty.body.firstName
      : false;
  const lastName = typeof requestProperty.body.lastName === 'string'
    && requestProperty.body.lastName.trim().length > 0
      ? requestProperty.body.lastName
      : false;
  const phone = typeof requestProperty.body.phone === 'string'
    && requestProperty.body.phone.trim().length === 11
      ? requestProperty.body.phone
      : false;
  const password = typeof requestProperty.body.password === 'string'
    && requestProperty.body.password.trim().length > 0
      ? requestProperty.body.password
      : false;
  if (phone) {
    // varify
    const token = typeof requestProperty.headers.token === 'string'
        ? requestProperty.headers.token
        : false;
    varify._token.varify(token, phone, (res) => {
      if (res) {
        if (firstName || lastName || password) {
          data.read('users', phone, (err, user) => {
            if (err) {
              callback(404, {
                error: 'user not found read',
              });
            } else {
              const upData = { ...jsonParse(user) };
              if (firstName) {
                upData.firstName = firstName;
              }
              if (password) {
                upData.password = hash(password);
              }
              if (lastName) {
                upData.lastName = lastName;
              }
              data.update('users', phone, upData, (upErr) => {
                if (upErr) {
                  callback(200, {
                    error: `yess, ${upErr}`,
                  });
                } else {
                  callback(500, {
                    massage: `Opps! ${upErr}`,
                  });
                }
              });
            }
          });
        } else {
          callback(400, {
            error: 'invalide field value',
          });
        }
      } else {
        callback(403, {
          error: 'Unauthenticated user',
        });
      }
    });
  } else {
    callback(400, {
      error: 'user not found',
    });
  }
};
handler._user.get = (requestProperty, callback) => {
  const phone = typeof requestProperty.queryString.phone === 'string'
    && requestProperty.queryString.phone.trim().length === 11
      ? requestProperty.queryString.phone
      : false;
  if (phone) {
    // varify
    const token = typeof requestProperty.headers.token === 'string'
        ? requestProperty.headers.token
        : false;
    varify._token.varify(token, phone, (res) => {
      if (res) {
        data.read('users', phone, (err, user) => {
          if (!err && user) {
            const u = { ...jsonParse(user) };
            delete u.password;
            callback(200, u);
          } else {
            callback(404, {
              error: 'user not found',
            });
          }
        });
      } else {
        callback(403, {
          error: 'Unauthenticated user',
        });
      }
    });
  } else {
    callback(404, {
      error: 'not valid user',
    });
  }
};
handler._user.delete = (requestProperty, callback) => {
  const phone = typeof requestProperty.body.phone === 'string'
    && requestProperty.body.phone.trim().length === 11
      ? requestProperty.body.phone
      : false;
  if (phone) {
    const token = typeof requestProperty.headers.token === 'string'
        ? requestProperty.headers.token
        : false;
    varify._token.varify(token, phone, (res) => {
      if (res) {
        data.read('users', phone, (reErr) => {
          if (!reErr) {
            data.delete('users', phone, (err) => {
              if (err) {
                callback(500, {
                  error: err,
                });
              } else {
                callback(200, {
                  massage: 'Ok delete',
                });
              }
            });
          } else {
            callback(500, {
              error: 'failed to delete read',
            });
          }
        });
      } else {
        callback(403, {
          error: 'Unauthenticated user',
        });
      }
    });
  } else {
    callback(404, {
      error: 'user not found',
    });
  }
};

module.exports = handler;
