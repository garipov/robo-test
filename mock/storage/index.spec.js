const storage = require('./');

const method = 'some-test-method';

test('basic set/get', () => {
  const opts = [{ a: 1 }];
  const data = [{ a: 1 }, { a: 1, b: 1 }, { a: 2 }];
  return storage.getOrSet(method, opts, () => Promise.resolve(data))
    .then(() => storage.getOrSet(method, opts))
    .then(saveData => expect(saveData).toEqual(data))
});

test('get by empty opts', () => {
  const opts = [];
  const data = [{ a: 3 }];
  return storage.getOrSet(method, opts, () => Promise.resolve(data))
    .then(() => storage.getOrSet(method, opts))
    .then(saveData => expect(saveData).toEqual(data))
});

test('set by opts1, get by opts2', () => {
  const opts1 = [{ a: 1 }];
  const opts2 = [{ a: 2 }];
  const data = [{ a: 1 }, { a: 1, b: 1 }, { a: 2 }];
  return storage.getOrSet(method, opts1, () => Promise.resolve(data))
    .then(() => storage.getOrSet(method, opts2))
    .then(saveData => expect(saveData).toEqual(null));
});