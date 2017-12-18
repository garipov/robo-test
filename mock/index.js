const _ = require('lodash');
const storage = require('./storage');
const promisify = require('../utils/promisify')

const mocks = {
  getcandles: '', // todo require(...)
}

module.exports = api => {
  _.assignWith(api, mocks, function (fn, mock, key) {
    return (...args) => {
      const callback = args.pop();
      storage.getOrSet(key, args, promisify(api, fn))
        .then(data => callback(null, data))
        .catch(err => callback(err))
    };
  });
}