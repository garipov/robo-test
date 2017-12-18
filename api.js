const mName = 'node.bittrex.api'; // otherwise vsCode is fail
const api = module.exports = require(mName);

api.options({
  'apikey': process.env.BITTREX_API_KEY,
  'apisecret': process.env.BITTREX_API_SECRET,
  'inverse_callback_arguments': true,
});

if (process.env.NODE_ENV === 'development') {
  require('./mock')(api);
}