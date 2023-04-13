var timeout = require('connect-timeout')
const morgan = require('morgan')

const cors = require('cors')
const express = require('express')

require('dotenv').config()
require('./src/config/db')
require('./src/config/passport');

const app = express()
app.use(timeout('5s'))
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(haltOnTimedout)

app.use('/auth', require('./src/routes/auth'))
app.use('/api', require('./src/routes/api'))

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next()
}

app.listen(process.env.PORT_SERVER || 4000, () => {
  console.log(`Api listen port: ${process.env.PORT_SERVER || 4000}`)
})