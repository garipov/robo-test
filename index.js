require('dotenv').config();

const api = require('./api');


// api.getmarketsummaries(function (err, data) {
//   if (err) {
//     return console.error(err);
//   }
//   console.log(data);
// });

// api.websockets.client(function() {
//   console.log('Websocket connected');
//   api.websockets.subscribe(['BTC-ETH'], function(data) {
//     if (data.M === 'updateExchangeState') {
//       data.A.forEach(function(data_for) {
//         console.log('Market Update for '+ data_for.MarketName, data_for);
//       });
//     }
//   });
// });

// api.websockets.listen(function(data, client) {
//   if (data.M === 'updateSummaryState') {
//     data.A.forEach(function(data_for) {
//       data_for.Deltas.forEach(function(marketsDelta) {
//         console.log('Ticker Update for '+ marketsDelta.MarketName, marketsDelta);
//       });
//     });
//   }
// });

// tickInterval: 'oneMin', 'fiveMin', 'thirtyMin, 'hour', 'day'

api.getcandles({
  marketName: 'USDT-BTC',
  tickInterval: 'hour',
}, function (err, data) {
  if (err) {
    console.error(err);
  }

  // data: {
  //   "success": true,
  //   "message": "",
  //   "result": [
  //     {
  //       "O": 0.02525,
  //       "H": 0.0254,
  //       "L": 0.02525,
  //       "C": 0.0254,
  //       "V": 67.44587598,
  //       "T": "2014-03-07T00:00:00",
  //       "BV": 1.70412525
  //     },
  //    ...
  //    ...
  // {
  //       "O": 0.01152093,
  //       "H": 0.011788,
  //       "L": 0.0113416,
  //       "C": 0.011691,
  //       "V": 107397.09516801,
  //       "T": "2017-08-25T00:00:00",
  //       "BV": 1241.90857854
  //     }
  //   ]
  // }



  // todo https://www.npmjs.com/package/macd
  // todo http://www.chartjs.org/samples/latest/
  // may be https://github.com/andredumas/techan.js
  // other api https://github.com/dparlevliet/node.bittrex.api
  // api https://bittrex.com/Home/Api
  console.log('candles count', data.result.length);
});