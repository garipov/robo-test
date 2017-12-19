import _ from 'lodash'
import React from 'react'
import Select from 'react-select'
import ReactTable from 'react-table'
import macd from 'macd'
import api from '../api/browser'

const percent = (value, percent) => value * (1 + percent / 100);

export default class extends React.Component {
  state = {
    candles: [],
    marketName: 'USDT-BTC',
    tickInterval: 'hour',
    tickIntervals: ['oneMin', 'fiveMin', 'thirtyMin', 'hour', 'day'],
    markets: [],

    macdSlowPeriods: 26,
    macdFastPeriods: 12,
    macdSignalPeriods: 9,
    macdField: 'C',
  }

  componentDidMount() {
    this.getCandles();
    this.getMarkets();
  }

  getCandles(params = this.state) {
    const { marketName, tickInterval } = params;
    return api('getcandles', [{ marketName, tickInterval }])
      .then(r => r.result)
      .then(candles => {
        this.setState({ candles }, this.calcMacd)
      })
  }

  getMarkets() {
    return api('getmarketsummaries')
      .then(r => r.result)
      .then(markets => {
        this.setState({ markets })
      })
  }

  calcMacd({ macdSlowPeriods, macdFastPeriods, macdSignalPeriods, macdField, candles } = this.state) {
    const { signal, histogram, MACD } = macd(
      candles.map(c => _.get(c, macdField)),
      macdSlowPeriods,
      macdFastPeriods,
      macdSignalPeriods
    )

    return this.setState({
      candles: candles.map((c, i) => Object.assign({}, c, {
        macd: {
          signal: signal[i],
          histogram: histogram[i],
          MACD: MACD[i],
        }
      }))
    }, this.calcProfit)
  }

  calcProfit({ candles } = this.state) {
    let buyPrice = null;
    let prevCond = null;
    const candlesWithProfit = candles.map(c => {
      const buyCondition = c.macd.histogram > 0;

      if (prevCond === null) {
        prevCond = buyCondition;
        return c;
      }

      const type = buyCondition ? 'buy' : 'sell';
      const price = c.C;
      const usd = 10;
      const lastAmount = usd / buyPrice;

      const order = prevCond !== buyCondition
        ? {
          type,
          profit: type === 'sell'
            ? percent(lastAmount * price, -0.25) - percent(usd, 0.25)
            : 0,
        }
        : null;

      if (order) {
        if (type === 'buy') {
          buyPrice = price;
        }
      }

      prevCond = buyCondition;

      return Object.assign({}, c, {
        order
      });
    })

    const sum = candlesWithProfit.reduce((sum, c) => {
      const profit = c.order && c.order.profit || 0;
      return sum + profit;
    }, 0)

    this.setState({
      profit: sum,
      candles: candlesWithProfit,
    })
  }

  updateCandles(params) {
    this.setState(params, state => {
      this.getCandles(state);
    });
  }

  updateMacd(params) {
    this.setState(params, state => {
      this.calcMacd(state);
    });
  }

  render() {
    const { props, state } = this;
    const {
      candles, markets, tickIntervals,
      tickInterval,
      marketName,
      macdSlowPeriods, macdFastPeriods, macdSignalPeriods, macdField,
      profit
    } = state;

    return (
      <div>
        <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-table/6.7.5/react-table.css" />

        <div>
          Пара:
        <Select
            options={markets.map(m => ({ value: m.MarketName, label: m.MarketName }))}
            clearable={false}
            value={marketName}
            onChange={o => this.updateCandles({ marketName: o.value })}
          />
        </div>
        <div>
          Интервал:
          <Select
            options={tickIntervals.map(v => ({ value: v, label: v }))}
            clearable={false}
            value={tickInterval}
            onChange={o => this.updateCandles({ tickInterval: o.value })}
          />
        </div>
        <div>
          MACD
          <div>
            <label>
              Быстрый период <input
                type="number"
                value={macdFastPeriods}
                onChange={e => this.updateMacd({ macdFastPeriods: e.target.value })} />
            </label>
            <label>
              Медленный период <input
                type="number"
                value={macdSlowPeriods}
                onChange={e => this.updateMacd({ macdSlowPeriods: e.target.value })} />
            </label>
            <label>
              Период сигнала <input
                type="number"
                value={macdSignalPeriods}
                onChange={e => this.updateMacd({ macdSignalPeriods: e.target.value })} />
            </label>
            <label>
              Поле <input
                value={macdField}
                onChange={e => this.updateMacd({ macdField: e.target.value })} />
            </label>
          </div>
        </div>
        <div>
          Профит: {profit}
        </div>
        <div>
          Данные:
          <ReactTable
            columns={[
              {
                Header: 'Тики (ticks)',
                columns: [
                  {
                    Header: "Time (T)",
                    accessor: "T",
                  },
                  {
                    Header: "Open (O)",
                    accessor: "O",
                  },
                  {
                    Header: "Close (C)",
                    accessor: "C",
                  },
                  {
                    Header: "Low (L)",
                    accessor: "L",
                  },
                  {
                    Header: "High (H)",
                    accessor: "H",
                  },
                  {
                    Header: "? (V)",
                    accessor: "V",
                  },
                  {
                    Header: "? (BV)",
                    accessor: "BV",
                  },
                ]
              },
              {
                Header: 'MACD',
                columns: [
                  {
                    Header: 'signal',
                    id: 'macd.signal',
                    accessor: d => d.macd && d.macd.signal,
                  },
                  {
                    Header: 'histogram',
                    id: 'macd.histogram',
                    accessor: d => d.macd && d.macd.histogram,
                  },
                  {
                    Header: 'MACD',
                    id: 'macd.MACD',
                    accessor: d => d.macd && d.macd.MACD,
                  },
                ]
              },
              {
                Header: 'Сделка',
                columns: [
                  {
                    Header: 'Тип',
                    id: 'order.type',
                    accessor: d => d.order && d.order.type,
                  },
                  {
                    Header: 'Профит',
                    id: 'order.profit',
                    accessor: d => d.order && d.order.profit,
                  },
                ]
              }
            ]}
            data={candles}
            defaultSorted={[
              {
                id: "T",
                desc: true
              }
            ]}
          />
        </div>
      </div>
    )
  }
}