const _ = require('lodash');
const storage = require('./storage');

module.exports = api => {
  return (method, ...params) => {
    return storage.getOrSet(method, params, () => api(method, ...params))
  };
}