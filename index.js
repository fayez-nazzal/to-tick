const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const apiRoutes = require('./routes/apiRoutes')
const authRoutes = require('./routes/auth/auth')
const cookieSession = require('cookie-session')
const keys = require('./config/keys')
const passport = require('passport')

require('dotenv').config()

const app = express()

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

const port = 5000;

mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

app.use(bodyParser.json())
app.use(cookieSession({
  expires: false,
  maxAge: 24 * 60 * 60 * 365 * 1000,
  keys: ['dfdfdsfd']
}))

app.use(passport.initialize())

app.use(passport.session())

const passportSetup = require('./config/passport-setup')


mongoose.connect("mongodb://localhost:27017/ttick")
  .then(() => console.log(`Database connected successfully`))
  .catch(err => console.log(err));


mongoose.Promise = global.Promise;

app.use('/api', apiRoutes)

app.use('/auth', authRoutes)


app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})