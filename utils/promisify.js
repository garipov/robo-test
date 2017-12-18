const _ = require('lodash');

function promisifyByContext(context, method) {
  return promisifyFn(context[method], context);
}

function promisifyFn(fn, context = null) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(context || this, ...args, (err, data) => {
        if (err) { return reject(err) }
        resolve(data);
      });
    })
  };
}

module.exports =
  function promisify(context, method) {
    [method, context] = _.isFunction(context)
      ? [context, method]
      : [method, context];

    return _.isFunction(method)
      ? promisifyFn(method, context)
      : promisifyByContext(context, method)
  }