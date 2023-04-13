var timeout = require('connect-timeout')
const morgan = require('morgan')
const passport = require('passport')
const cors = require('cors')
const express = require('express')

require('dotenv').config()
require('./server/config/db')
require('./server/config/passport');

const app = express()
app.use(timeout('5s'))
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(haltOnTimedout)

app.get('/auth/google',
  passport.authenticate('admin_google', {
    scope: ['email', 'profile']
  }
  ));
  
app.get('/auth/google/callback',
  passport.authenticate('admin_google', {
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure'
  }));

app.use('/api', require('./server/routes/api'))

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next()
}

app.listen(process.env.PORT_SERVER || 4000, () => {
  console.log(`Api listen port: ${process.env.PORT_SERVER || 4000}`)
})