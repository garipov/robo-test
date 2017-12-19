require('dotenv').config();
const express = require('express')
const { parse } = require('url')
const next = require('next')
const bodyParser = require('body-parser')

const api = require('./api/server')

const dev = process.env.NODE_ENV === 'development'

const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  express()
    // parse application/x-www-form-urlencoded
    .use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    .use(bodyParser.json())

    .use('/api/:method', (req, res, next) => {
      const { method } = req.params;
      const params = req.body.params || [];
      console.log('http: api', method, params)
      api(method, ...params)
        .then(r => res.json(r))
        .catch(err => next(err))
    })

    .use((req, res) => {
      handle(req, res)
    })

    .listen(process.env.PORT, err => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })
})