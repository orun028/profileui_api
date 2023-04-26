require('dotenv').config()
const conn = require('./db');
const morgan = require('morgan')
const cors = require('cors')
const passport = require('passport')
const MongoStore = require('connect-mongo')
const express = require('express')
const session = require('express-session')
const app = express()
const { PORT, SESSION_SECRET } = process.env

const sessionStore = MongoStore.create({
  clientPromise: conn,
})

const sess = {
  resave: false,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  cookie: {
    maxAge: 60 * 60 * 24
  },
  store: sessionStore
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
  sess.cookie.secure = true 
}

app.disable('x-powered-by');
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session(sess))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('Hey this is my API running!');
})
app.use('/auth', require('./routes/auth'))
app.use('/api', require('./routes/api'))

app.listen(PORT, () => {
  console.log(`Api listen port: ${PORT}`)
})

module.exports = app;