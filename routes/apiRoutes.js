const express = require('express')
const router = express.Router()
const todos = require('./api/ticks')
const groups=require('./api/groups')
const users = require('./api/users')
const userinfo = require('./api/userinfo')

router.use('/ticks', todos)
router.use('/groups', groups)
router.use('/users', users)
router.use('/userinfo', userinfo)

module.exports = router