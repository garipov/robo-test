const mName = 'node.bittrex.api'; // otherwise vsCode is fail
const api = require(mName);
const promisify = require('../utils/promisify');

api.options({
  'apikey': process.env.BITTREX_API_KEY,
  'apisecret': process.env.BITTREX_API_SECRET,
  'inverse_callback_arguments': true,
});

const execApi = function (method, ...params) {
  return promisify(api, method)(...params)
    .catch(err => {
      throw err instanceof Error
        ? err
        : new Error(err && err.message || err)
    });
};

module.exports = execApi

if (process.env.NODE_ENV === 'development') {
  module.exports = require('../mock')(execApi);
}

