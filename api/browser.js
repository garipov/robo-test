module.exports = function (method, params = []) {
  return fetch(
    '/api/' + method,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ params }),
    }
  )
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return res.text().then(err => {
        throw Object.assign(new Error(err), {
          status: res.status,
          statusText: res.statusText,
        });
      });
    });
}
