const path = require('path');
const _ = require('lodash');
const stringify = require('fast-json-stable-stringify');
const Datastore = require('nedb');
const promisify = require('../../utils/promisify')

const getDb = _.memoize(function (method) {
  const base = path.resolve(__dirname, 'data', method);
  return {
    opts: new Datastore({ filename: path.resolve(base, 'opts'), autoload: true }),
    data: new Datastore({ filename: path.resolve(base, 'data'), autoload: true }),
  };
})

function getId(db, opts = []) {
  const query = stringify(opts);
  return promisify(db.opts, 'findOne')({ query })
    .then(r => r && r._id);
}

function createId(db, opts = []) {
  const query = stringify(opts);
  return promisify(db.opts, 'insert')({ query })
    .then(r => r._id);
}

function getData(db, optsId) {
  return promisify(db.data, 'findOne')({ optsId })
    .then(r => r && r.data);
}

function createData(db, optsId, data) {
  return promisify(db.data, 'insert')({ optsId, data })
    .then(r => r && r.data);
}

module.exports.getOrSet = (method, opts = [], dataFetcher = null) => {
  const db = getDb(method);
  return getId(db, opts)
    .then(optsId => {
      if (optsId) {
        return getData(db, optsId);
      }
      return dataFetcher && dataFetcher(...opts)
        .then(data => createId(db, opts).then(optsId => ({ optsId, data })))
        .then(({ optsId, data }) => createData(db, optsId, data))
        || null;
    })
}